import {
  type ProfileImageryKind,
  type ProfileImagerySpec,
} from "~/lib/profile-imagery/types";

/** Largest accepted source file, in bytes. */
export const MAX_SOURCE_BYTES = 4 * 1024 * 1024;

/** Source formats the processor accepts. */
export const ACCEPTED_SOURCE_MIME_TYPES = ["image/jpeg", "image/png"] as const;

/** WebP encode quality, as the 0-1 float the Canvas encode APIs expect. */
export const WEBP_QUALITY = 0.82;

export const DERIVATIVE_MIME_TYPE = "image/webp" as const;

export const PROFILE_IMAGERY_SPECS: Record<
  ProfileImageryKind,
  ProfileImagerySpec
> = {
  profile: {
    aspectWidth: 1,
    aspectHeight: 1,
    maxWidth: 512,
    maxHeight: 512,
  },
  cover: {
    aspectWidth: 4,
    aspectHeight: 1,
    maxWidth: 1600,
    maxHeight: 400,
  },
};
