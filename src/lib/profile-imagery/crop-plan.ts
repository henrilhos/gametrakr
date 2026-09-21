import { type ProfileImagerySpec } from "~/lib/profile-imagery/types";

/**
 * A resolved center-crop: the source rectangle to read (`sx`/`sy`/`sWidth`/
 * `sHeight`) and the derivative's final pixel size (`outputWidth`/
 * `outputHeight`), matching the 9-argument `drawImage` signature shared by
 * `CanvasRenderingContext2D` and `OffscreenCanvasRenderingContext2D`.
 */
export interface CropPlan {
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
  outputWidth: number;
  outputHeight: number;
}

/**
 * Computes the largest centered rectangle of `spec`'s aspect ratio that
 * fits inside a `sourceWidth`x`sourceHeight` source, then sizes the
 * derivative down to fit within `spec`'s max dimensions without ever
 * upscaling past the cropped source's own resolution.
 */
export function computeCropPlan(
  sourceWidth: number,
  sourceHeight: number,
  spec: ProfileImagerySpec,
): CropPlan {
  const targetAspect = spec.aspectWidth / spec.aspectHeight;
  const sourceAspect = sourceWidth / sourceHeight;

  let cropWidth: number;
  let cropHeight: number;

  if (sourceAspect > targetAspect) {
    // Source is relatively wider than the target: use the full height and
    // crop the sides.
    cropHeight = sourceHeight;
    cropWidth = Math.round(sourceHeight * targetAspect);
  } else {
    // Source is relatively taller (or already matches): use the full width
    // and crop top/bottom.
    cropWidth = sourceWidth;
    cropHeight = Math.round(sourceWidth / targetAspect);
  }

  // Rounding can push the crop rectangle a pixel past the source bounds;
  // clamp it back in.
  cropWidth = Math.min(cropWidth, sourceWidth);
  cropHeight = Math.min(cropHeight, sourceHeight);

  const sx = Math.min(
    Math.max(0, Math.round((sourceWidth - cropWidth) / 2)),
    sourceWidth - cropWidth,
  );
  const sy = Math.min(
    Math.max(0, Math.round((sourceHeight - cropHeight) / 2)),
    sourceHeight - cropHeight,
  );

  // Never upscale: only shrink the cropped rectangle down to the max size.
  const scale = Math.min(
    1,
    spec.maxWidth / cropWidth,
    spec.maxHeight / cropHeight,
  );
  const outputWidth = Math.max(1, Math.round(cropWidth * scale));
  const outputHeight = Math.max(1, Math.round(cropHeight * scale));

  return {
    sx,
    sy,
    sWidth: cropWidth,
    sHeight: cropHeight,
    outputWidth,
    outputHeight,
  };
}
