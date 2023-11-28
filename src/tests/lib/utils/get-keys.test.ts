import { describe, expect, it } from "vitest";
import { getKeys } from "~/lib/utils";

describe("get keys util", () => {
  it("should return an array of keys for an object", () => {
    const result = getKeys({
      crash: "bandicoot",
      sonic: "hedgehog",
      mario: "bros",
    });

    expect(result.length).toBe(3);
    expect(result.includes("crash")).toBe(true);
    expect(result.includes("sonic")).toBe(true);
    expect(result.includes("mario")).toBe(true);
  });

  it("should return an empty array for an empty object", () => {
    const result = getKeys({});

    expect(result.length).toBe(0);
  });
});
