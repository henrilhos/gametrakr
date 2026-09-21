// One-off generator for the real image fixtures used by
// src/tests/lib/profile-imagery/*.test.ts.
//
// These are genuine, decodable JPEG/PNG/GIF files produced with
// @napi-rs/canvas (a real Skia-backed encoder) - not hand-rolled byte
// arrays - so the processor tests exercise real decode/crop/resize/encode
// behavior. Re-run with `node src/tests/fixtures/profile-imagery/generate-fixtures.mjs`
// if the fixture set needs to change.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas } from "@napi-rs/canvas";

const dir = dirname(fileURLToPath(import.meta.url));

/**
 * @param {import("@napi-rs/canvas").SKRSContext2D} ctx
 * @param {number} w
 * @param {number} h
 */
function drawGradient(ctx, w, h) {
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, "#e6553f");
  gradient.addColorStop(0.5, "#4fae5f");
  gradient.addColorStop(1, "#3f6fe6");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

// 1. Wide JPEG source - exercises center-crop to both square (profile) and
// 4:1 (cover) derivatives (both land exactly on their max dimensions at
// this size), and has no alpha channel (JPEG can't carry one).
//
// Layout is deliberate for pixel-sampling assertions:
// - A marker square sits at (10,10)-(60,60), outside the centered crop
//   window for *both* derivatives, so it should never survive cropping.
// - A cross through the exact center sits inside the centered crop window
//   for both derivatives, so it should always survive cropping.
function makeLandscapeJpeg() {
  const w = 2000;
  const h = 1000;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");
  drawGradient(ctx, w, h);
  ctx.fillStyle = "#111827";
  ctx.fillRect(w / 2 - 4, 0, 8, h);
  ctx.fillRect(0, h / 2 - 4, w, 8);
  ctx.fillStyle = "#ff00ff";
  ctx.fillRect(10, 10, 50, 50);
  return canvas.toBuffer("image/jpeg", 90);
}

// 7. Large, high-detail JPEG that stays just under the 4 MB accept limit -
// a representative "big photo" source (as opposed to oversized.jpg, which
// exists purely to be rejected) to prove the WebP derivative it produces
// is materially smaller.
function makeLargeJpeg() {
  const w = 3000;
  const h = 2000;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");
  drawGradient(ctx, w, h);
  for (let i = 0; i < 20000; i++) {
    ctx.fillStyle = `rgba(${(Math.random() * 255) | 0},${(Math.random() * 255) | 0},${(Math.random() * 255) | 0},0.5)`;
    ctx.fillRect((Math.random() * w) | 0, (Math.random() * h) | 0, 6, 6);
  }
  return canvas.toBuffer("image/jpeg", 92);
}

// 2. Tall PNG source with a genuine alpha channel - exercises center-crop
// from a portrait source and transparency preservation.
function makePortraitTransparentPng() {
  const w = 600;
  const h = 900;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");
  // Fully transparent background.
  ctx.clearRect(0, 0, w, h);
  // Opaque circle in the center, fading to transparent at the very edge,
  // so the corners of every crop stay transparent while the center does not.
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) / 2.2;
  const grad = ctx.createRadialGradient(cx, cy, radius * 0.6, cx, cy, radius);
  grad.addColorStop(0, "rgba(79,174,95,1)");
  grad.addColorStop(1, "rgba(79,174,95,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  return canvas.toBuffer("image/png");
}

// 3. Small square PNG, well under both max profile dimensions - exercises
// "do not unnecessarily upscale smaller sources" for the profile derivative.
function makeSmallSquarePng() {
  const size = 100;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  drawGradient(ctx, size, size);
  return canvas.toBuffer("image/png");
}

// 4. Small already-4:1 PNG, well under the cover max dimensions - exercises
// "do not unnecessarily upscale smaller sources" for the cover derivative.
function makeSmallWidePng() {
  const w = 200;
  const h = 50;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");
  drawGradient(ctx, w, h);
  return canvas.toBuffer("image/png");
}

// 5. Oversized JPEG (> 4 MB) - exercises source-size rejection. High
// frequency per-pixel noise defeats JPEG compression so the real encoded
// file lands comfortably over the limit.
function makeOversizedJpeg() {
  const w = 2000;
  const h = 1500;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(w, h);
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = Math.random() * 255;
    imageData.data[i + 1] = Math.random() * 255;
    imageData.data[i + 2] = Math.random() * 255;
    imageData.data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toBuffer("image/jpeg", 100);
}

// 6. Real (small, valid) GIF - exercises unsupported-format rejection with
// a genuine, decodable image that just isn't JPEG/PNG.
function makeUnsupportedGif() {
  const size = 64;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  drawGradient(ctx, size, size);
  return canvas.encodeSync("gif", 10);
}

/** @type {Array<{name: string, buffer: Buffer}>} */
const fixtures = [
  { name: "landscape.jpg", buffer: makeLandscapeJpeg() },
  { name: "portrait-transparent.png", buffer: makePortraitTransparentPng() },
  { name: "small-square.png", buffer: makeSmallSquarePng() },
  { name: "small-wide.png", buffer: makeSmallWidePng() },
  { name: "oversized.jpg", buffer: makeOversizedJpeg() },
  { name: "unsupported.gif", buffer: makeUnsupportedGif() },
  { name: "large.jpg", buffer: makeLargeJpeg() },
];

for (const { name, buffer } of fixtures) {
  writeFileSync(join(dir, name), buffer);
  console.log(name, buffer.length, "bytes");
}
