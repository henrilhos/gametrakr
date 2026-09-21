import { createCanvas, loadImage, type Image } from "@napi-rs/canvas";
import { type CanvasEngine } from "~/lib/profile-imagery/canvas-engine";

/**
 * Test-only stand-in for `browserCanvasEngine`, backed by the real
 * Skia-based decoder/encoder in @napi-rs/canvas instead of a browser. It
 * implements the exact same `CanvasEngine` seam `processProfileImagery`
 * depends on, so tests exercise real decode -> crop -> resize -> encode
 * behavior against real image fixtures without mocking any pixel work or
 * requiring a browser.
 */
export const nodeCanvasEngine: CanvasEngine<Image> = {
  async decodeImage(file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const image = await loadImage(buffer);
    return {
      width: image.width,
      height: image.height,
      drawable: image,
      dispose: () => {
        // @napi-rs/canvas Image instances don't hold external resources
        // that need explicit release.
      },
    };
  },
  createCanvas(width, height) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    return {
      getContext: () => context,
      encodeToBlob: ({ mimeType, quality }) =>
        canvas.convertToBlob({ mime: mimeType, quality }),
    };
  },
};
