import { loadTensorflowModel, type TfliteModel } from 'react-native-fast-tflite';
import type { Image } from 'react-native-nitro-image';

import { MODEL_CONFIG } from './config';
import { toModelInput, toRgbBytes } from './preprocess';
import { toPrediction } from './postprocess';
import type { Classifier, Prediction } from './types';

export class TfliteClassifier implements Classifier {
  readonly modelVersion = MODEL_CONFIG.modelVersion;
  readonly isStub = false;

  private constructor(private readonly model: TfliteModel) {}

  static async load(asset: number): Promise<TfliteClassifier> {
    // CPU delegate first: predictable on low-end phones. Benchmark 'nnapi'/'android-gpu' later.
    const model = await loadTensorflowModel(asset, []);
    const input = model.inputs[0];
    const output = model.outputs[0];
    if (output.dataType !== 'float32') {
      throw new Error(
        `Model output is ${output.dataType}; export with float32 output (int8 weights, float I/O) so no de-quantisation is needed in JS.`,
      );
    }
    const [, h, w, c] = input.shape;
    if (h !== MODEL_CONFIG.inputSize || w !== MODEL_CONFIG.inputSize || c !== 3) {
      throw new Error(`Unexpected model input shape [${input.shape.join(', ')}]`);
    }
    return new TfliteClassifier(model);
  }

  async classify(image: Image): Promise<Prediction> {
    const t0 = Date.now();
    const rgb = await toRgbBytes(image);
    const input = toModelInput(rgb, this.model.inputs[0].dataType);
    const [out] = await this.model.run([input]);
    return toPrediction(new Float32Array(out), {
      latencyMs: Date.now() - t0,
      modelVersion: this.modelVersion,
      isStub: false,
    });
  }
}
