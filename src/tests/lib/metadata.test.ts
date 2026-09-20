import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMetadata } from "~/lib/metadata";

const { redis } = vi.hoisted(() => ({
  redis: { get: vi.fn(), set: vi.fn() },
}));

vi.mock("@upstash/redis", () => ({
  Redis: { fromEnv: () => redis },
}));

describe("getMetadata", () => {
  const url = "https://gametra.kr";
  const metadata = {
    title: "gametrakr",
    description: "track your games",
    image: "https://gametra.kr/image.png",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it("should return the cached metadata without fetching", async () => {
    redis.get.mockResolvedValue(metadata);

    const result = await getMetadata(url);

    expect(result).toStrictEqual(metadata);
    expect(redis.get).toBeCalledWith(url);
    expect(redis.set).not.toBeCalled();
  });

  it("should fetch, cache and return metadata when not cached", async () => {
    redis.get.mockResolvedValue(null);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve(metadata),
      }),
    );

    const result = await getMetadata(url);

    expect(result).toStrictEqual(metadata);
    expect(fetch).toBeCalledWith(`https://api.dub.co/metatags?url=${url}`);
    expect(redis.set).toBeCalledWith(url, metadata, { ex: 60 * 60 });
  });

  it("should cache and return null when the fetch fails", async () => {
    redis.get.mockResolvedValue(null);
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")));

    const result = await getMetadata(url);

    expect(result).toBeNull();
    expect(redis.set).toBeCalledWith(url, null, { ex: 60 * 60 });
  });

  it("should cache and return null when the response fails validation", async () => {
    redis.get.mockResolvedValue(null);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ title: "gametrakr" }),
      }),
    );

    const result = await getMetadata(url);

    expect(result).toBeNull();
    expect(redis.set).toBeCalledWith(url, null, { ex: 60 * 60 });
  });
});
