import { afterEach, describe, expect, it, vi } from "vitest";
import { browserCanvasEngine } from "~/lib/profile-imagery/canvas-engine";

/**
 * `browserCanvasEngine` is the engine that actually ships to the browser,
 * but Vitest runs in Node, which has neither `createImageBitmap` nor
 * `OffscreenCanvas`. These tests stub those two *platform* globals - not
 * any of our own crop/resize/validate logic - so the engine's own wiring
 * (does it call `.close()` on dispose? does it forward `mimeType`/`quality`
 * correctly? does it skip object URLs entirely?) is exercised for real
 * rather than assumed. Image *processing* itself is covered elsewhere
 * (process-profile-imagery.test.ts) against the real @napi-rs/canvas
 * engine and real fixtures.
 */
describe("browserCanvasEngine", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("decodes a file via createImageBitmap without creating an object URL", async () => {
    const close = vi.fn();
    const createImageBitmap = vi
      .fn()
      .mockResolvedValue({ width: 42, height: 24, close });
    const createObjectURL = vi.fn();
    vi.stubGlobal("createImageBitmap", createImageBitmap);
    vi.stubGlobal("URL", { ...URL, createObjectURL });

    const file = new File([new Uint8Array([1, 2, 3])], "source.png", {
      type: "image/png",
    });
    const decoded = await browserCanvasEngine.decodeImage(file);

    expect(createImageBitmap).toHaveBeenCalledWith(file);
    expect(createObjectURL).not.toHaveBeenCalled();
    expect(decoded.width).toBe(42);
    expect(decoded.height).toBe(24);

    expect(close).not.toHaveBeenCalled();
    decoded.dispose();
    expect(close).toHaveBeenCalledTimes(1);
  });

  it("encodes via OffscreenCanvas.convertToBlob with the requested mime type and quality", async () => {
    const expectedBlob = new Blob(["fake-webp-bytes"], { type: "image/webp" });
    const convertToBlob = vi.fn().mockResolvedValue(expectedBlob);
    const drawImage = vi.fn();
    const clearRect = vi.fn();
    const context = { drawImage, clearRect };
    const getContext = vi.fn().mockReturnValue(context);

    class FakeOffscreenCanvas {
      width: number;
      height: number;
      constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
      }
      getContext = getContext;
      convertToBlob = convertToBlob;
    }
    vi.stubGlobal("OffscreenCanvas", FakeOffscreenCanvas);

    const canvas = browserCanvasEngine.createCanvas(512, 512);
    expect(canvas.getContext("2d")).toBe(context);

    const blob = await canvas.encodeToBlob({
      mimeType: "image/webp",
      quality: 0.82,
    });

    expect(convertToBlob).toHaveBeenCalledWith({
      type: "image/webp",
      quality: 0.82,
    });
    expect(blob).toBe(expectedBlob);
  });

  it("falls back to an in-DOM canvas when OffscreenCanvas is unavailable", async () => {
    vi.stubGlobal("OffscreenCanvas", undefined);

    const expectedBlob = new Blob(["fake-webp-bytes"], { type: "image/webp" });
    const drawImage = vi.fn();
    const clearRect = vi.fn();
    const context = { drawImage, clearRect };
    const toBlob = vi.fn(
      (
        callback: (blob: Blob | null) => void,
        _mimeType?: string,
        _quality?: number,
      ) => callback(expectedBlob),
    );
    const fakeCanvasElement = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue(context),
      toBlob,
    };
    const createElement = vi.fn().mockReturnValue(fakeCanvasElement);
    vi.stubGlobal("document", { createElement });

    const canvas = browserCanvasEngine.createCanvas(200, 50);

    expect(createElement).toHaveBeenCalledWith("canvas");
    expect(fakeCanvasElement.width).toBe(200);
    expect(fakeCanvasElement.height).toBe(50);

    const blob = await canvas.encodeToBlob({
      mimeType: "image/webp",
      quality: 0.82,
    });

    expect(toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      "image/webp",
      0.82,
    );
    expect(blob).toBe(expectedBlob);
  });
});
