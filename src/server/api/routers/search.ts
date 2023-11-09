import {
  and,
  fields,
  igdb,
  limit,
  offset,
  search,
  twitchAccessToken,
  whereIn,
  WhereInFlags,
} from "ts-igdb-client";
import { z } from "zod";

import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import type { db as prismaDB } from "~/server/db";
import type { proto } from "ts-igdb-client";

export const TWITCH_SECRETS = {
  client_id: env.TWITCH_CLIENT_ID,
  client_secret: env.TWITCH_SECRET_ID,
};

const unixTimestampToYear = (unixTimestamp?: number | null) => {
  if (!unixTimestamp) return;

  const date = new Date(unixTimestamp * 1000); // JavaScript expects milliseconds, so multiply by 1000
  return date.getFullYear();
};

type User = {
  username: string;
  image: string | null;
  _count: {
    followers: number;
    follows: number;
  };
};
const filterUserForClient = (user: User) => {
  return {
    image: user.image ?? "",
    name: user.username ?? "",
    followersCount: user._count.followers ?? 0,
    followsCount: user._count.follows ?? 0,
  };
};

const filterGameForClient = (game: proto.IGame) => {
  const developers =
    game.involved_companies
      ?.filter((c) => c.developer)
      .map((c) => c.company?.name) ?? [];

  return {
    name: game.name ?? "",
    rating: Math.round(game.aggregated_rating ?? 0),
    releaseYear: unixTimestampToYear(game.first_release_date),
    slug: game.slug ?? "",
    image: (game.cover?.url ?? "")
      .replace("thumb", "cover_small_2x")
      .replace("//", "https://"),
    developer: developers.length > 0 ? developers.join(", ") : undefined,
  };
};

type SearchForUsersProps = {
  query: string;
  db: typeof prismaDB;
};
const searchForUsers = async ({ query, db }: SearchForUsersProps) => {
  return (
    await db.user.findMany({
      where: { username: { contains: query } },
      select: {
        username: true,
        image: true,
        _count: { select: { followers: true, follows: true } },
      },
      take: 4,
    })
  ).map(filterUserForClient);
};

const searchForGames = async ({
  query,
  limit: l = 0,
  cursor = 0,
}: {
  query: string;
  limit?: number;
  cursor?: number;
}) => {
  const accessToken = await twitchAccessToken(TWITCH_SECRETS);
  const igdbClient = igdb(TWITCH_SECRETS.client_id, accessToken);

  return (
    await igdbClient
      .request("games")
      .pipe(
        search(query),
        fields([
          "name",
          "slug",
          "cover.url",
          "aggregated_rating",
          "first_release_date",
          "involved_companies.company.name",
          "involved_companies.developer",
          "involved_companies.publisher",
        ]),
        and(
          whereIn("category", [0, 8, 9, 10, 11], WhereInFlags.OR),
          // where("aggregated_rating", "!=", null),
        ),
        limit(l),
        offset(cursor),
      )
      .execute()
  ).data.map(filterGameForClient);
};

export const searchRouter = createTRPCRouter({
  getAllByQuery: publicProcedure
    .meta({ description: "Search" })
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      const query = input.query.trim();

      const users = await searchForUsers({ query, db: ctx.db });
      const games = await searchForGames({ query, limit: 7 });

      const bestResult = games.shift();
      if (bestResult) {
        bestResult.image = bestResult?.image.replace("small", "big");
      }

      return {
        bestResult,
        users,
        games,
      };
    }),
  getGames: publicProcedure
    .meta({ description: "Search games" })
    .input(
      z.object({
        query: z.string(),
        limit: z.number(),
        cursor: z.number().optional().nullable(),
      }),
    )
    .query(async ({ ctx: _, input }) => {
      const { query, limit, cursor } = input;

      console.log("A", { query, limit, cursor });

      const games = await searchForGames({
        query,
        limit: limit,
        cursor: cursor ?? 0,
      });

      return { games, limit, nextCursor: (cursor ?? 0) + limit };
    }),
});
