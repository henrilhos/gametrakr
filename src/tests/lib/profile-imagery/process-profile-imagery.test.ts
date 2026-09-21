import { describe, expect, it } from "vitest";
import {
  MAX_SOURCE_BYTES,
  PROFILE_IMAGERY_SPECS,
} from "~/lib/profile-imagery/constraints";
import {
  ProfileImagerySourceTooLargeError,
  ProfileImageryUnsupportedFormatError,
} from "~/lib/profile-imagery/errors";
import { processProfileImagery } from "~/lib/profile-imagery/process-profile-imagery";
import { decodeBlobToPixels } from "~/tests/lib/profile-imagery/support/decode-blob";
import { loadFixtureFile } from "~/tests/lib/profile-imagery/support/load-fixture";
import { nodeCanvasEngine } from "~/tests/lib/profile-imagery/support/node-canvas-engine";

describe("processProfileImagery", () => {
  it("accepts a JPEG source and produces a profile derivative", async () => {
    const file = loadFixtureFile("landscape.jpg", "image/jpeg");

    const result = await processProfileImagery(
      { kind: "profile", file },
      nodeCanvasEngine,
    );

    expect(result.kind).toBe("profile");
    expect(result.mimeType).toBe("image/webp");
  });

  it("accepts a PNG source and produces a cover derivative", async () => {
    const file = loadFixtureFile("portrait-transparent.png", "image/png");

    const result = await processProfileImagery(
      { kind: "cover", file },
      nodeCanvasEngine,
    );

    expect(result.kind).toBe("cover");
    expect(result.mimeType).toBe("image/webp");
  });

  it("produces a square profile derivative", async () => {
    const file = loadFixtureFile("landscape.jpg", "image/jpeg");

    const result = await processProfileImagery(
      { kind: "profile", file },
      nodeCanvasEngine,
    );

    expect(result.width).toBe(result.height);
  });

  it("produces a 4:1 cover derivative", async () => {
    const file = loadFixtureFile("landscape.jpg", "image/jpeg");

    const result = await processProfileImagery(
      { kind: "cover", file },
      nodeCanvasEngine,
    );

    expect(result.width / result.height).toBeCloseTo(4, 5);
  });

  it("caps the profile derivative at 512x512", async () => {
    const file = loadFixtureFile("landscape.jpg", "image/jpeg");

    const result = await processProfileImagery(
      { kind: "profile", file },
      nodeCanvasEngine,
    );

    expect(result.width).toBe(PROFILE_IMAGERY_SPECS.profile.maxWidth);
    expect(result.height).toBe(PROFILE_IMAGERY_SPECS.profile.maxHeight);
  });

  it("caps the cover derivative at 1600x400", async () => {
    const file = loadFixtureFile("landscape.jpg", "image/jpeg");

    const result = await processProfileImagery(
      { kind: "cover", file },
      nodeCanvasEngine,
    );

    expect(result.width).toBe(PROFILE_IMAGERY_SPECS.cover.maxWidth);
    expect(result.height).toBe(PROFILE_IMAGERY_SPECS.cover.maxHeight);
  });

  it("center-crops out content far from the source's center", async () => {
    // landscape.jpg has a magenta marker at (10,10)-(60,60), well outside
    // the centered crop window for both the profile and cover derivatives.
    const file = loadFixtureFile("landscape.jpg", "image/jpeg");

    const profile = await processProfileImagery(
      { kind: "profile", file },
      nodeCanvasEngine,
    );
    const cover = await processProfileImagery(
      {
        kind: "cover",
        file: loadFixtureFile("landscape.jpg", "image/jpeg"),
      },
      nodeCanvasEngine,
    );

    const profilePixels = await decodeBlobToPixels(profile.blob);
    const coverPixels = await decodeBlobToPixels(cover.blob);

    // The top-left corner of every derivative maps back to source content
    // near its own center-crop window, not the excluded marker - so it
    // should not be the marker's magenta.
    const isMagenta = (pixel: [number, number, number, number]) =>
      pixel[0] > 200 && pixel[1] < 60 && pixel[2] > 200;

    expect(isMagenta(profilePixels.pixelAt(0, 0))).toBe(false);
    expect(isMagenta(coverPixels.pixelAt(0, 0))).toBe(false);
  });

  it("keeps content from the source's exact center", async () => {
    // landscape.jpg has a dark cross through its exact center, which lies
    // inside the centered crop window for both derivatives.
    const file = loadFixtureFile("landscape.jpg", "image/jpeg");

    const result = await processProfileImagery(
      { kind: "profile", file },
      nodeCanvasEngine,
    );

    const pixels = await decodeBlobToPixels(result.blob);
    const [r, g, b] = pixels.pixelAt(
      Math.floor(pixels.width / 2),
      Math.floor(pixels.height / 2),
    );

    expect(r).toBeLessThan(60);
    expect(g).toBeLessThan(60);
    expect(b).toBeLessThan(60);
  });

  it("preserves transparency from a PNG source", async () => {
    const file = loadFixtureFile("portrait-transparent.png", "image/png");

    const result = await processProfileImagery(
      { kind: "profile", file },
      nodeCanvasEngine,
    );

    const pixels = await decodeBlobToPixels(result.blob);
    const center = pixels.pixelAt(
      Math.floor(pixels.width / 2),
      Math.floor(pixels.height / 2),
    );
    const corner = pixels.pixelAt(1, 1);

    // The source is an opaque-centered radial gradient fading to fully
    // transparent at the edges, so the center should stay opaque while a
    // corner should stay (close to) transparent.
    expect(center[3]).toBeGreaterThan(200);
    expect(corner[3]).toBeLessThan(50);
  });

  it("does not upscale a small square source for the profile derivative", async () => {
    const file = loadFixtureFile("small-square.png", "image/png");

    const result = await processProfileImagery(
      { kind: "profile", file },
      nodeCanvasEngine,
    );

    expect(result.width).toBe(100);
    expect(result.height).toBe(100);
  });

  it("does not upscale a small 4:1 source for the cover derivative", async () => {
    const file = loadFixtureFile("small-wide.png", "image/png");

    const result = await processProfileImagery(
      { kind: "cover", file },
      nodeCanvasEngine,
    );

    expect(result.width).toBe(200);
    expect(result.height).toBe(50);
  });

  it("produces a derivative materially smaller than a representative large source", async () => {
    const file = loadFixtureFile("large.jpg", "image/jpeg");

    const result = await processProfileImagery(
      { kind: "profile", file },
      nodeCanvasEngine,
    );

    expect(result.byteSize).toBeLessThan(file.size * 0.1);
  });

  it("rejects a source over the 4 MB limit", async () => {
    const file = loadFixtureFile("oversized.jpg", "image/jpeg");
    expect(file.size).toBeGreaterThan(MAX_SOURCE_BYTES);

    await expect(
      processProfileImagery({ kind: "profile", file }, nodeCanvasEngine),
    ).rejects.toBeInstanceOf(ProfileImagerySourceTooLargeError);
  });

  it("rejects an unsupported source format", async () => {
    const file = loadFixtureFile("unsupported.gif", "image/gif");

    await expect(
      processProfileImagery({ kind: "profile", file }, nodeCanvasEngine),
    ).rejects.toBeInstanceOf(ProfileImageryUnsupportedFormatError);
  });
});
