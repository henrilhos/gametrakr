import {
  browserCanvasEngine,
  type CanvasEngine,
} from "~/lib/profile-imagery/canvas-engine";
import {
  ACCEPTED_SOURCE_MIME_TYPES,
  DERIVATIVE_MIME_TYPE,
  MAX_SOURCE_BYTES,
  PROFILE_IMAGERY_SPECS,
  WEBP_QUALITY,
} from "~/lib/profile-imagery/constraints";
import { computeCropPlan } from "~/lib/profile-imagery/crop-plan";
import {
  ProfileImagerySourceTooLargeError,
  ProfileImageryUnsupportedFormatError,
} from "~/lib/profile-imagery/errors";
import {
  type ProcessedProfileImagery,
  type ProcessProfileImageryInput,
} from "~/lib/profile-imagery/types";

function assertValidSource(file: File): void {
  if (
    !ACCEPTED_SOURCE_MIME_TYPES.includes(
      file.type as (typeof ACCEPTED_SOURCE_MIME_TYPES)[number],
    )
  ) {
    throw new ProfileImageryUnsupportedFormatError(file.type);
  }

  if (file.size > MAX_SOURCE_BYTES) {
    throw new ProfileImagerySourceTooLargeError(file.size, MAX_SOURCE_BYTES);
  }
}

/**
 * Converts an accepted JPEG/PNG source into a small, canonical,
 * center-cropped WebP derivative, entirely in the browser and before any
 * upload begins. The source is discarded once the derivative is produced -
 * there is no original-retention path.
 *
 * This is the one client interface UI callers use: provide a `kind` and a
 * source `file`, get back verified output metadata. It knows nothing about
 * UploadThing, local development, routes, or environment mode - what
 * happens to the returned blob is entirely up to the caller.
 */
export async function processProfileImagery(
  { kind, file }: ProcessProfileImageryInput,
  engine: CanvasEngine = browserCanvasEngine,
): Promise<ProcessedProfileImagery> {
  assertValidSource(file);

  const spec = PROFILE_IMAGERY_SPECS[kind];
  const source = await engine.decodeImage(file);

  try {
    const plan = computeCropPlan(source.width, source.height, spec);
    const canvas = engine.createCanvas(plan.outputWidth, plan.outputHeight);
    const context = canvas.getContext("2d");

    // Explicitly clear (rather than assume) so transparency is preserved
    // for sources with an alpha channel instead of compositing onto an
    // opaque default.
    context.clearRect(0, 0, plan.outputWidth, plan.outputHeight);
    context.drawImage(
      source.drawable,
      plan.sx,
      plan.sy,
      plan.sWidth,
      plan.sHeight,
      0,
      0,
      plan.outputWidth,
      plan.outputHeight,
    );

    const blob = await canvas.encodeToBlob({
      mimeType: DERIVATIVE_MIME_TYPE,
      quality: WEBP_QUALITY,
    });

    return {
      kind,
      blob,
      mimeType: DERIVATIVE_MIME_TYPE,
      width: plan.outputWidth,
      height: plan.outputHeight,
      byteSize: blob.size,
    };
  } finally {
    // Release decode-side browser resources (e.g. the ImageBitmap) whether
    // processing succeeded or failed.
    source.dispose();
  }
}
