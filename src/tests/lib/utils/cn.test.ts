import { describe, expect, it } from "vitest";
import { cn } from "~/lib/utils";

describe("cn util", () => {
  it("should merge the inputs", () => {
    const expected = "p-5 m-2 bg-black";

    expect(cn(["bg-white p-5", "m-2 bg-black"])).toBe(expected);
  });
});
