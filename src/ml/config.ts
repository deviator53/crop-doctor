import { CLASS_IDS } from './types';

/**
 * Written by the training pipeline (training/export_model.py) and pasted here.
 * Proposal §7.3: temperature scaling on the validation set, and a threshold chosen as
 * the lowest value at which accepted predictions reach 90% precision.
 */
export const MODEL_CONFIG = {
  modelVersion: 'demo-0',
  inputSize: 224,
  classOrder: CLASS_IDS, // must match the training label order exactly
  /** Normalisation used when the model takes float32 input: (x / 255 - mean) / std */
  mean: [0, 0, 0],
  std: [1, 1, 1],
  /** true if the .tflite outputs logits, false if it already applies softmax */
  outputIsLogits: true,
  temperature: 1.0, // TODO: fit on validation set
  acceptThreshold: 0.6, // TODO: choose on validation set (90% precision rule)
} as const;
