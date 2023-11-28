import { describe, expect, it } from "vitest";
import { unixTimestampToYear } from "~/lib/utils";

describe("unix timestamp to year", () => {
  it("should return the correct year for a valid timestamp", () => {
    const unix = 1670562000; // December 9, 2022

    expect(unixTimestampToYear(unix)).toBe(2022);
  });

  it("should return undefined for undefined timestamp", () => {
    expect(unixTimestampToYear()).toBe(undefined);
  });

  it("should return undefined for null timestamp", () => {
    expect(unixTimestampToYear(null)).toBe(undefined);
  });

  it("should return undefined for a timestamp of 0", () => {
    expect(unixTimestampToYear(0)).toBe(undefined);
  });
});
