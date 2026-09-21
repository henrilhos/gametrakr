/**
 * The two Profile imagery derivatives a Registered user can replace. See
 * CONTEXT.md and docs/adr for the "Profile imagery" / "Public profile"
 * vocabulary this module operates under.
 */
export type ProfileImageryKind = "profile" | "cover";

/** What a UI caller hands the processor: a kind plus the source file. */
export interface ProcessProfileImageryInput {
  kind: ProfileImageryKind;
  file: File;
}

/**
 * Verified output metadata needed to begin a replacement. Deliberately free
 * of any adapter, transport, or storage concept - callers still decide how
 * (and whether) `blob` gets uploaded.
 */
export interface ProcessedProfileImagery {
  kind: ProfileImageryKind;
  blob: Blob;
  mimeType: "image/webp";
  width: number;
  height: number;
  byteSize: number;
}

/** Target shape for a Profile imagery derivative. */
export interface ProfileImagerySpec {
  /** Width component of the required aspect ratio (e.g. 4 for 4:1). */
  aspectWidth: number;
  /** Height component of the required aspect ratio (e.g. 1 for 4:1). */
  aspectHeight: number;
  maxWidth: number;
  maxHeight: number;
}
