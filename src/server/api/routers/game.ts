import { and, fields, igdb, twitchAccessToken, where } from "ts-igdb-client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// TODO: put on a new file
import { TWITCH_SECRETS } from "./search";

import type { proto } from "ts-igdb-client";

const filterGameForClient = (game: proto.IGame) => {
  return {
    name: game.name ?? "",
    summary: game.summary ?? "",
    releaseDate: new Date((game.first_release_date ?? 0) * 1000),
    genres: game.genres?.map((g) => g.name ?? "") ?? [],
    platforms: game.platforms?.map((p) => p.name ?? "") ?? [],
    developers:
      game.involved_companies
        ?.filter((ic) => ic.developer)
        .map((ic) => ic.company?.name ?? "") ?? [],
    cover:
      (game.cover?.url ?? "")
        .replace("thumb", "cover_big")
        .replace("//", "https://") ?? "",
    images:
      game.screenshots?.map(
        (s) => s.url?.replace("thumb", "1080p").replace("//", "https://") ?? "",
      ) ?? [],
  };
};

export const gameRouter = createTRPCRouter({
  getBySlug: publicProcedure
    .meta({ description: "Get game by slug" })
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const slug = input.slug.trim();

      const accessToken = await twitchAccessToken(TWITCH_SECRETS);
      const igdbClient = igdb(TWITCH_SECRETS.client_id, accessToken);

      return (
        await igdbClient
          .request("games")
          .pipe(
            fields([
              "name",
              "summary",
              "first_release_date",
              "genres.name",
              "platforms.name",
              "involved_companies.company.name",
              "involved_companies.developer",
              "cover.url",
              "screenshots.url",
            ]),
            and(where("slug", "=", slug)),
          )
          .execute()
      ).data.map(filterGameForClient)[0];
    }),
});
