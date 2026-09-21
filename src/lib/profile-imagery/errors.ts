/** The source file exceeds `MAX_SOURCE_BYTES`. */
export class ProfileImagerySourceTooLargeError extends Error {
  constructor(byteSize: number, maxByteSize: number) {
    super(
      `Profile imagery source is ${byteSize} bytes, which exceeds the ${maxByteSize} byte limit.`,
    );
    this.name = "ProfileImagerySourceTooLargeError";
  }
}

/** The source file's type is not one of `ACCEPTED_SOURCE_MIME_TYPES`. */
export class ProfileImageryUnsupportedFormatError extends Error {
  constructor(mimeType: string) {
    super(`Profile imagery source type "${mimeType}" is not supported.`);
    this.name = "ProfileImageryUnsupportedFormatError";
  }
}
