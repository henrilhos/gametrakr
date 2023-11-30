import { db } from "~/server/db/db";
import { games } from "~/server/db/schema";

type CreateGameProps = {
  slug: string;
  name: string;
  cover: string;
  releaseDate: Date;
};

export const isGameOnDb = async (slug: string) => {
  const data = await db.query.games.findFirst({
    where: (game, { eq }) => eq(game.slug, slug),
    columns: { id: true },
  });

  return Boolean(data);
};

export const getGameBySlug = (slug: string) => {
  return db.query.games.findFirst({
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

export const createGame = (data: CreateGameProps) => {
  return db.insert(games).values(data);
};
