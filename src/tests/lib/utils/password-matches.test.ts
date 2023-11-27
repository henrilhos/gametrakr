import { describe, expect, it } from "vitest";
import { passwordMatches } from "~/lib/utils";

describe("password matches util", () => {
  it("should return true", () => {
    expect(passwordMatches("asdf@1234", "asdf@1234")).toBeTruthy();
  });

  it("should return false", () => {
    expect(passwordMatches("1234@asdf", "asdf@1234")).toBeFalsy();
  });
});
