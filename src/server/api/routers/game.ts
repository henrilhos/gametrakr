import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import * as dbUtils from "~/server/db/utils";
import { getGameBySlug, getGames } from "~/server/igdb";

const GamesByQuerySchema = z.object({
  query: z.string(),
  limit: z.number().optional().default(10),
  cursor: z.number().optional().default(0),
});

export const gameRouter = createTRPCRouter({
  findManyByQuery: publicProcedure
    .input(GamesByQuerySchema)
    .query(async ({ input }) => {
      const { query, limit, cursor } = input;
      const decodedQuery = decodeURI(query).trim();

      const games = await getGames({ query: decodedQuery, limit, cursor });

      return { games, limit, nextCursor: cursor + limit };
    }),

  findFirstBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const { slug } = input;

      const data = await getGameBySlug({ slug });
      if (!data?.name) {
        throw Error("Game not found");
      }

      const isGameOnDb = await dbUtils.isGameOnDb(slug);
      if (!isGameOnDb) {
        await dbUtils.createGame({
          slug,
          cover: data.cover,
          name: data.name,
          releaseDate: data.releaseDate,
        });
      }

      const game = await dbUtils.getGameBySlug(slug);

      if (!game) {
        throw Error("Game not found");
      }

      return { ...data, ...game };
    }),
});
