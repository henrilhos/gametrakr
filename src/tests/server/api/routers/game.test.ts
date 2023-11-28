import { NextRequest } from "next/server";
import { type inferProcedureInput } from "@trpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter, type AppRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import * as igdb from "~/server/igdb";

vi.mock("~/server/auth");
vi.mock("~/server/db");
vi.mock("~/server/igdb");
vi.mock("resend");

describe("game router", async () => {
  const req = new NextRequest("https://gametra.kr");
  const ctx = await createInnerTRPCContext(req);
  const caller = appRouter.createCaller(ctx);

  describe("find many by query query", async () => {
    type Input = inferProcedureInput<AppRouter["game"]["findManyByQuery"]>;
    const input: Input = { query: "zelda" };

    const game = {
      developers: ["naughty dog"],
      image: "super-amazing-image",
      name: "crash bandicoot",
      rating: 75,
      releaseYear: 1996,
      slug: "crash-bandicoot",
    };

    beforeEach(() => {
      vi.resetAllMocks();
      vi.mocked(igdb.getGames).mockResolvedValue([game]);
    });

    it("should return a list of games", async () => {
      const response = await caller.game.findManyByQuery(input);

      expect(response.games).toHaveLength(1);
      expect(response.games[0]).toStrictEqual(game);
      expect(response.limit).toBe(10);
      expect(response.nextCursor).toBe(10);
    });

    it("should have pagination and limit", async () => {
      const response = await caller.game.findManyByQuery({
        ...input,
        limit: 5,
        cursor: 15,
      });

      expect(response.limit).toBe(5);
      expect(response.nextCursor).toBe(20);
    });
  });

  describe("find first by slug query", async () => {
    type Input = inferProcedureInput<AppRouter["game"]["findFirstBySlug"]>;
    const input: Input = { slug: "crash-bandicoot" };

    const game = {
      cover: "super-amazing-cover",
      criticRating: 75,
      developers: ["naughty dog"],
      genres: ["platform"],
      images: ["super-amazing-image"],
      name: "crash bandicoot",
      platforms: [{ name: "playstation" }],
      releaseDate: new Date(),
      summary: "super amazing summary",
      createdAt: new Date(),
      id: "super-amazing-id",
      slug: "crash-bandicoot",
      updatedAt: new Date(),
    };

    beforeEach(() => {
      vi.resetAllMocks();
      vi.mocked(igdb.getGameBySlug).mockResolvedValue(game);
    });

    it("should return a list of games", async () => {
      const response = await caller.game.findFirstBySlug(input);

      expect(response).toStrictEqual(game);
    });
  });
});
