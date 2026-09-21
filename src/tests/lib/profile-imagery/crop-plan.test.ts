import { describe, expect, it } from "vitest";
import { PROFILE_IMAGERY_SPECS } from "~/lib/profile-imagery/constraints";
import { computeCropPlan } from "~/lib/profile-imagery/crop-plan";

describe("computeCropPlan", () => {
  it("crops a wide source down to a centered square for the profile spec", () => {
    const plan = computeCropPlan(2000, 1000, PROFILE_IMAGERY_SPECS.profile);

    expect(plan.sWidth).toBe(1000);
    expect(plan.sHeight).toBe(1000);
    expect(plan.sx).toBe(500);
    expect(plan.sy).toBe(0);
  });

  it("crops a tall source down to a centered square for the profile spec", () => {
    const plan = computeCropPlan(600, 900, PROFILE_IMAGERY_SPECS.profile);

    expect(plan.sWidth).toBe(600);
    expect(plan.sHeight).toBe(600);
    expect(plan.sx).toBe(0);
    expect(plan.sy).toBe(150);
  });

  it("crops a source down to a centered 4:1 rectangle for the cover spec", () => {
    const plan = computeCropPlan(2000, 1000, PROFILE_IMAGERY_SPECS.cover);

    expect(plan.sWidth).toBe(2000);
    expect(plan.sHeight).toBe(500);
    expect(plan.sx).toBe(0);
    expect(plan.sy).toBe(250);
  });

  it("caps the output at the spec's max dimensions", () => {
    const plan = computeCropPlan(2000, 1000, PROFILE_IMAGERY_SPECS.profile);

    expect(plan.outputWidth).toBe(512);
    expect(plan.outputHeight).toBe(512);
  });

  it("caps a cover derivative at its max dimensions", () => {
    const plan = computeCropPlan(2000, 1000, PROFILE_IMAGERY_SPECS.cover);

    expect(plan.outputWidth).toBe(1600);
    expect(plan.outputHeight).toBe(400);
  });

  it("does not upscale a source already smaller than the max dimensions", () => {
    const plan = computeCropPlan(100, 100, PROFILE_IMAGERY_SPECS.profile);

    expect(plan.outputWidth).toBe(100);
    expect(plan.outputHeight).toBe(100);
  });

  it("does not upscale a small already-4:1 source for the cover spec", () => {
    const plan = computeCropPlan(200, 50, PROFILE_IMAGERY_SPECS.cover);

    expect(plan.outputWidth).toBe(200);
    expect(plan.outputHeight).toBe(50);
  });

  it("keeps the output aspect ratio within one pixel's worth of rounding error", () => {
    // Whole-pixel rounding means an arbitrary source can't always crop to
    // a perfectly exact ratio (e.g. 777 wide can't split into an exact
    // 4:1 height: 777 / 4 = 194.25, which rounds to 194). Bound the drift
    // by what a single pixel of height quantization can actually cause,
    // rather than an arbitrary loose tolerance.
    const plan = computeCropPlan(777, 421, PROFILE_IMAGERY_SPECS.cover);
    const ratio = plan.outputWidth / plan.outputHeight;
    const maxDriftFromOnePixel = 4 / plan.outputHeight;

    expect(Math.abs(ratio - 4)).toBeLessThan(maxDriftFromOnePixel);
  });
});
