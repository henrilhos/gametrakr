import { type Image } from "@napi-rs/canvas";
import { describe, expect, it } from "vitest";
import { type CanvasEngine } from "~/lib/profile-imagery/canvas-engine";
import { processProfileImagery } from "~/lib/profile-imagery/process-profile-imagery";
import { loadFixtureFile } from "~/tests/lib/profile-imagery/support/load-fixture";
import { nodeCanvasEngine } from "~/tests/lib/profile-imagery/support/node-canvas-engine";

/**
 * Wraps the real (fixture-backed) node canvas engine with dispose-call
 * counting, so we can assert on real release behavior instead of just
 * trusting the processor's own bookkeeping.
 */
function withDisposeSpy(engine: CanvasEngine<Image>) {
  let disposeCalls = 0;
  const spied: CanvasEngine<Image> = {
    ...engine,
    decodeImage: async (file) => {
      const decoded = await engine.decodeImage(file);
      return {
        ...decoded,
        dispose: () => {
          disposeCalls += 1;
          decoded.dispose();
        },
      };
    },
  };
  return { engine: spied, disposeCalls: () => disposeCalls };
}

describe("processProfileImagery resource release", () => {
  it("releases the decoded source after a successful run", async () => {
    const { engine, disposeCalls } = withDisposeSpy(nodeCanvasEngine);
    const file = loadFixtureFile("landscape.jpg", "image/jpeg");

    await processProfileImagery({ kind: "profile", file }, engine);

    expect(disposeCalls()).toBe(1);
  });

  it("releases the decoded source even if encoding fails", async () => {
    const { engine, disposeCalls } = withDisposeSpy({
      ...nodeCanvasEngine,
      createCanvas: () => ({
        getContext: () => ({
          clearRect: () => undefined,
          drawImage: () => undefined,
        }),
        encodeToBlob: () => Promise.reject(new Error("encode failed")),
      }),
    });
    const file = loadFixtureFile("landscape.jpg", "image/jpeg");

    await expect(
      processProfileImagery({ kind: "profile", file }, engine),
    ).rejects.toThrow("encode failed");
    expect(disposeCalls()).toBe(1);
  });
});
