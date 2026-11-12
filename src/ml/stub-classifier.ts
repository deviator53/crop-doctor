import type { Image } from 'react-native-nitro-image';

import { MODEL_CONFIG } from './config';
import { toPrediction } from './postprocess';
import { toRgbBytes } from './preprocess';
import type { Classifier, Prediction } from './types';

/**
 * Stand-in used until the trained model exists. It still runs the REAL preprocessing
 * (crop, resize, pixel read) so latency numbers for that stage are meaningful, then derives a
 * pseudo-random but repeatable result from the pixels. Its output means nothing.
 */
export class StubClassifier implements Classifier {
  readonly modelVersion = 'stub';
  readonly isStub = true;

  async classify(image: Image): Promise<Prediction> {
    const t0 = Date.now();
    const rgb = await toRgbBytes(image);

    let seed = 2166136261;
    for (let i = 0; i < rgb.length; i += 97) seed = Math.imul(seed ^ rgb[i], 16777619) >>> 0;

    const n = MODEL_CONFIG.classOrder.length;
    const logits = Array.from({ length: n }, (_, i) => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return (seed / 2 ** 32) * 3 + (i === seed % n ? 2.5 : 0);
    });

    return toPrediction(logits, {
      latencyMs: Date.now() - t0,
      modelVersion: this.modelVersion,
      isStub: true,
    });
  }
}
