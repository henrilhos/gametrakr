import { db } from "~/server/db";
import { games } from "~/server/db/schema";

type NewGame = typeof games.$inferInsert;

export const getGameIdBySlug = async (slug: string) => {
  return await db.query.games.findFirst({
    where: (game, { eq }) => eq(game.slug, slug),
    columns: { id: true },
  });
};

export const getGameBySlug = async (slug: string) => {
  return await db.query.games.findFirst({
    where: (game, { eq }) => eq(game.slug, slug),
    with: {
      reviews: {
        columns: {
          content: true,
          isSpoiler: true,
          rating: true,
          createdAt: true,
        },
        with: {
          user: { columns: { username: true, profileImage: true } },
        },
        where: (review, { eq }) => eq(review.active, true),
        orderBy: (review, { desc }) => desc(review.createdAt),
      },
    },
  });
};

export const createGame = async (data: NewGame) => {
  return await db.insert(games).values(data);
};
