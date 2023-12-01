import { db } from "~/server/db/db";
import { games } from "~/server/db/schema";

type NewGame = typeof games.$inferInsert;

const getUserRating = (ratings: (number | null)[] | undefined) => {
  if (!ratings) return undefined;

  const validRatings = ratings.filter((r) => !!r);
  if (validRatings.length === 0) return undefined;

  const sumOfRatings =
    validRatings.reduce((sum, rating) => {
      if (!rating) return sum;
      return (sum ?? 0) + rating;
    }, 0) ?? 0;

  return Math.round((sumOfRatings / validRatings.length) * 10);
};

export const isGameOnDb = async (slug: string) => {
  const data = await db.query.games.findFirst({
    where: (game, { eq }) => eq(game.slug, slug),
    columns: { id: true },
  });

  return Boolean(data);
};

export const getGameBySlug = async (slug: string) => {
  const game = await db.query.games.findFirst({
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

  if (!game) return undefined;
  return {
    ...game,
    userRating: getUserRating(game?.reviews.map((r) => r.rating)),
  };
};

export const createGame = async (data: NewGame) => {
  await db.insert(games).values(data);
};
