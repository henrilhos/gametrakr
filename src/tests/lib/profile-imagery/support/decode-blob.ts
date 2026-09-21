import { createCanvas, loadImage } from "@napi-rs/canvas";

export interface DecodedBlobImage {
  width: number;
  height: number;
  /** RGBA bytes, 0-255, for the pixel at (x, y). */
  pixelAt(x: number, y: number): [number, number, number, number];
}

/**
 * Decodes a processor output `Blob` back into pixels, using the same real
 * Skia decoder the test support engine uses to decode fixtures - so tests
 * can assert on actual encoded pixel data (crop placement, alpha, etc.)
 * rather than trusting the processor's own bookkeeping.
 */
export async function decodeBlobToPixels(
  blob: Blob,
): Promise<DecodedBlobImage> {
  const buffer = Buffer.from(await blob.arrayBuffer());
  const image = await loadImage(buffer);
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
  const { data } = context.getImageData(0, 0, image.width, image.height);

  return {
    width: image.width,
    height: image.height,
    pixelAt: (x, y) => {
      const offset = (y * image.width + x) * 4;
      return [
        data[offset]!,
        data[offset + 1]!,
        data[offset + 2]!,
        data[offset + 3]!,
      ];
    },
  };
}
