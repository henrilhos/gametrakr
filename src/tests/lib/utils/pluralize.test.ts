import { describe, expect, it } from "vitest";
import { pluralize } from "~/lib/utils";

describe("pluralize util", () => {
  it("should returns the singular form", () => {
    const apple = pluralize("apples", "apple");

    expect(apple(1)).toBe("apple");
  });

  it("should returns the plural form", () => {
    const apple = pluralize("apples", "apple");

    expect(apple(2)).toBe("apples");
  });

  it("should returns the plural form for negative numbers", () => {
    const apple = pluralize("apples", "apple");

    expect(apple(-2)).toBe("apples");
  });
});
