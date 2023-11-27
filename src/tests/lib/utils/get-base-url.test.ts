import { beforeEach, describe, expect, it, vi } from "vitest";
import { getBaseUrl } from "~/lib/utils";

describe("get base url util", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("should return base url for production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("BASE_URL", "crash.bandicoot");

    expect(getBaseUrl()).toBe("https://crash.bandicoot");
  });

  it("should return base url for vercel", () => {
    vi.stubEnv("VERCEL_URL", "sonic.hedgehog");

    expect(getBaseUrl()).toBe("https://sonic.hedgehog");
  });

  it("should return base url for local", () => {
    vi.stubEnv("HOSTNAME", "mario");
    vi.stubEnv("PORT", "peach");

    expect(getBaseUrl()).toBe("http://mario:peach");
  });

  it("should return base url for local with default values", () => {
    expect(getBaseUrl()).toBe("http://localhost:3000");
  });
});
