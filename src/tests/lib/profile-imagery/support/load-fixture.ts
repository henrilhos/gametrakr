import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
  "fixtures",
  "profile-imagery",
);

/**
 * Loads a real, checked-in image fixture as a `File`, the same shape a UI
 * caller hands `processProfileImagery`. `mimeType` is set explicitly
 * because that's what a browser file input / drop event would supply as
 * `File.type` - it is not re-derived from the fixture's bytes.
 */
export function loadFixtureFile(name: string, mimeType: string): File {
  const buffer = readFileSync(join(fixturesDir, name));
  return new File([buffer], name, { type: mimeType });
}
