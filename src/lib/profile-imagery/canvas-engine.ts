/**
 * The pixel-manipulation seam behind the processor. `processProfileImagery`
 * only ever talks to this interface, which is what lets its crop/resize/
 * validate orchestration be exercised in tests against a real (non-browser)
 * Canvas 2D implementation instead of a mocked one - see
 * src/tests/lib/profile-imagery/support/node-canvas-engine.ts.
 *
 * `TDrawable` is whatever the engine's own `drawImage` accepts (an
 * `ImageBitmap` in the browser).
 */
export interface DecodedImage<TDrawable> {
  readonly width: number;
  readonly height: number;
  readonly drawable: TDrawable;
  /** Releases any resources the engine held for this decode. */
  dispose(): void;
}

export interface DrawImage2DContext<TDrawable> {
  clearRect(x: number, y: number, w: number, h: number): void;
  drawImage(
    image: TDrawable,
    sx: number,
    sy: number,
    sWidth: number,
    sHeight: number,
    dx: number,
    dy: number,
    dWidth: number,
    dHeight: number,
  ): void;
}

export interface EncodableCanvas<TDrawable> {
  getContext(kind: "2d"): DrawImage2DContext<TDrawable>;
  encodeToBlob(options: { mimeType: string; quality: number }): Promise<Blob>;
}

export interface CanvasEngine<TDrawable = unknown> {
  decodeImage(file: File | Blob): Promise<DecodedImage<TDrawable>>;
  createCanvas(width: number, height: number): EncodableCanvas<TDrawable>;
}

function getOffscreen2dContext(
  canvas: OffscreenCanvas,
): DrawImage2DContext<ImageBitmap> {
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to acquire a 2d canvas context.");
  }
  return context;
}

function toBlobFallback(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas encoding produced no data."));
        }
      },
      mimeType,
      quality,
    );
  });
}

/**
 * The real, production Canvas engine: browser-native `createImageBitmap`
 * and `OffscreenCanvas` (falling back to an in-DOM `<canvas>` for browsers
 * without `OffscreenCanvas`). Has no notion of UploadThing, local
 * development, routes, or environment mode - it only touches pixels.
 */
export const browserCanvasEngine: CanvasEngine<ImageBitmap> = {
  async decodeImage(file) {
    // createImageBitmap decodes a File/Blob directly - no
    // URL.createObjectURL detour, so there is no object URL to revoke.
    // The one resource this does hold (the ImageBitmap itself) is released
    // via `dispose` below.
    const bitmap = await createImageBitmap(file);
    return {
      width: bitmap.width,
      height: bitmap.height,
      drawable: bitmap,
      dispose: () => bitmap.close(),
    };
  },
  createCanvas(width, height) {
    if (typeof OffscreenCanvas !== "undefined") {
      const canvas = new OffscreenCanvas(width, height);
      return {
        getContext: () => getOffscreen2dContext(canvas),
        encodeToBlob: ({ mimeType, quality }) =>
          canvas.convertToBlob({ type: mimeType, quality }),
      };
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Unable to acquire a 2d canvas context.");
    }

    return {
      getContext: () => context,
      encodeToBlob: ({ mimeType, quality }) =>
        toBlobFallback(canvas, mimeType, quality),
    };
  },
};
