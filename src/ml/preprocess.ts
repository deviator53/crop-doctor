import type { Image, PixelFormat } from 'react-native-nitro-image';

import { MODEL_CONFIG } from './config';

/**
 * Centre-crop to a square, resize to the model input size, and return tightly packed RGB.
 * All heavy work (crop, resize) happens natively; JS only reorders ~150 KB of bytes.
 */
export async function toRgbBytes(image: Image): Promise<Uint8Array> {
  const size = MODEL_CONFIG.inputSize;

  const side = Math.min(image.width, image.height);
  const cropped = image.crop(
    Math.floor((image.width - side) / 2),
    Math.floor((image.height - side) / 2),
    Math.floor((image.width + side) / 2),
    Math.floor((image.height + side) / 2),
  );
  const resized = await cropped.resizeAsync(size, size);
  const raw = await resized.toRawPixelDataAsync();

  const src = new Uint8Array(raw.buffer);
  const out = new Uint8Array(size * size * 3);
  const [ri, gi, bi, stride] = channelOffsets(raw.pixelFormat);
  // Rows may be padded on some devices; derive the row stride from the buffer length.
  const rowStride = Math.floor(src.length / raw.height);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const s = y * rowStride + x * stride;
      const d = (y * size + x) * 3;
      out[d] = src[s + ri];
      out[d + 1] = src[s + gi];
      out[d + 2] = src[s + bi];
    }
  }
  return out;
}

function channelOffsets(format: PixelFormat): [number, number, number, number] {
  switch (format) {
    case 'RGBA':
    case 'RGBX':
      return [0, 1, 2, 4];
    case 'BGRA':
    case 'BGRX':
      return [2, 1, 0, 4];
    case 'ARGB':
    case 'XRGB':
      return [1, 2, 3, 4];
    case 'ABGR':
    case 'XBGR':
      return [3, 2, 1, 4];
    case 'RGB':
      return [0, 1, 2, 3];
    case 'BGR':
      return [2, 1, 0, 3];
    default:
      throw new Error(`Unsupported pixel format: ${format}`);
  }
}

/** Convert RGB bytes into the tensor layout the model expects (uint8 or normalised float32). */
export function toModelInput(rgb: Uint8Array, dataType: string): ArrayBuffer {
  if (dataType === 'uint8') {
    return rgb.buffer.slice(rgb.byteOffset, rgb.byteOffset + rgb.byteLength) as ArrayBuffer;
  }
  if (dataType === 'float32') {
    const out = new Float32Array(rgb.length);
    const { mean, std } = MODEL_CONFIG;
    for (let i = 0; i < rgb.length; i++) {
      const c = i % 3;
      out[i] = (rgb[i] / 255 - mean[c]) / std[c];
    }
    return out.buffer;
  }
  throw new Error(`Unsupported model input type: ${dataType}. Export with uint8 or float32 input.`);
}
