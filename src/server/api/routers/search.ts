import { type User } from "@prisma/client";
import {
  and,
  fields,
  igdb,
  limit,
  sort,
  twitchAccessToken as TwitchAccessToken,
  where,
  WhereFlags,
  whereIn,
  WhereInFlags,
} from "ts-igdb-client";
import { z } from "zod";

import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import type { db as prismaDB } from "~/server/db";
import type { proto } from "ts-igdb-client";

const TWITCH_SECRETS = {
  client_id: env.TWITCH_CLIENT_ID,
  client_secret: env.TWITCH_SECRET_ID,
};

const unixTimestampToYear = (unixTimestamp: number) => {
  const date = new Date(unixTimestamp * 1000); // JavaScript expects milliseconds, so multiply by 1000
  return date.getFullYear();
};

const filterUserForClient = (user: User) => {
  return {
    image: user.image ?? "",
    name: user.username ?? "",
    slug: user.username ?? "",
  };
};

const filterGameForClient = (game: proto.IGame) => {
  return {
    image: (game.cover?.url ?? "").replace("t_thumb", "t_cover_small_2x"),
    name: game.name ?? "",
    rating: Math.round(game.aggregated_rating ?? 0),
    releaeYear: unixTimestampToYear(game.first_release_date ?? 0),
    slug: game.slug ?? "",
    publisher:
      game.involved_companies?.filter((c) => c.publisher)[0]?.company?.name ??
      "",
  };
};

type SearchForUsersProps = {
  query: string;
  db: typeof prismaDB;
};
const searchForUsers = async ({ query, db }: SearchForUsersProps) => {
  return (
    await db.user.findMany({
      where: {
        username: {
          contains: query,
        },
      },
    })
  ).map(filterUserForClient);
};

const searchForGames = async ({ query }: { query: string }) => {
  const twitchAccessToken = await TwitchAccessToken(TWITCH_SECRETS);
  const igdbClient = igdb(TWITCH_SECRETS.client_id, twitchAccessToken);

  return (
    await igdbClient
      .request("games")
      .pipe(
        fields([
          "name",
          "slug",
          "cover.url",
          "aggregated_rating",
          "first_release_date",
          "involved_companies.company.name",
          "involved_companies.publisher",
        ]),
        sort("aggregated_rating", "desc"),
        and(
          where("name", "~", query, WhereFlags.CONTAINS),
          whereIn("category", [0, 8, 9, 10, 11], WhereInFlags.OR),
          where("aggregated_rating", "!=", null),
        ),
        limit(10),
      )
      .execute()
  ).data.map(filterGameForClient);
};

export const searchRouter = createTRPCRouter({
  search: publicProcedure
    .meta({ description: "Search" })
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      const query = input.query.trim();

      const users = await searchForUsers({ query, db: ctx.db });
      const games = await searchForGames({ query });

      let topResult;
      if (games.length > 0) {
        topResult = games.shift();
      }

      return {
        message: `Searching for ${query}`,
        data: { users, games, topResult },
      };
    }),
});
