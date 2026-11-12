import { MODEL_ASSET } from './model-asset';
import { StubClassifier } from './stub-classifier';
import { TfliteClassifier } from './tflite-classifier';
import type { Classifier } from './types';

let cached: Promise<Classifier> | null = null;

/** Loads the real model when one is bundled, otherwise the demo stub. Loaded once. */
export function getClassifier(): Promise<Classifier> {
  cached ??= MODEL_ASSET == null ? Promise.resolve(new StubClassifier()) : TfliteClassifier.load(MODEL_ASSET);
  return cached;
}

export * from './types';
