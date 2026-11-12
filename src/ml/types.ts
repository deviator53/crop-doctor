import type { Image } from 'react-native-nitro-image';

export const CLASS_IDS = [
  'cmd', // cassava mosaic disease
  'cbsd', // cassava brown streak disease (early-warning class, East African training images)
  'nlb', // northern leaf blight (maize)
  'southern_rust', // maize
  'msv', // maize streak virus
  'healthy_cassava',
  'healthy_maize',
] as const;

export type ClassId = (typeof CLASS_IDS)[number];

export interface Prediction {
  /** Top-1 class (even when not accepted, kept for logging). */
  classId: ClassId;
  /** Calibrated top-1 probability, 0..1. */
  confidence: number;
  /** false => show "not recognised" and queue the photo for expert referral. */
  accepted: boolean;
  /** Top-3 calibrated probabilities, for the log and for research analysis. */
  top3: { classId: ClassId; p: number }[];
  latencyMs: number;
  modelVersion: string;
  /** true when the result came from the demo stub, never from a trained model. */
  isStub: boolean;
}

export interface Classifier {
  readonly modelVersion: string;
  readonly isStub: boolean;
  /** `image` comes from `photo.toImageAsync()` (orientation already applied). */
  classify(image: Image): Promise<Prediction>;
}
