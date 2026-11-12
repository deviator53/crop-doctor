import { MODEL_CONFIG } from './config';
import type { Prediction } from './types';

export function softmax(values: ArrayLike<number>, temperature = 1): number[] {
  const scaled = Array.from(values, (v) => v / temperature);
  const max = Math.max(...scaled);
  const exps = scaled.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

/** Turn raw model output into a calibrated prediction with the accept/refer decision. */
export function toPrediction(
  output: ArrayLike<number>,
  meta: { latencyMs: number; modelVersion: string; isStub: boolean },
): Prediction {
  const probs = MODEL_CONFIG.outputIsLogits
    ? softmax(output, MODEL_CONFIG.temperature)
    : Array.from(output);

  const ranked = probs
    .map((p, i) => ({ classId: MODEL_CONFIG.classOrder[i], p }))
    .sort((a, b) => b.p - a.p);

  const top = ranked[0];
  return {
    classId: top.classId,
    confidence: top.p,
    accepted: top.p >= MODEL_CONFIG.acceptThreshold,
    top3: ranked.slice(0, 3),
    ...meta,
  };
}
