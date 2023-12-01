import { eq } from "drizzle-orm";
import { type Review } from "~/server/api/schemas/review";
import { db } from "~/server/db";
import { reviews } from "~/server/db/schema";

export const getReviewIdByGameAndUserId = async (
  gameId: string,
  userId: string,
) => {
  return await db.query.reviews.findFirst({
    where: (review, { eq, and }) =>
      and(eq(review.gameId, gameId), eq(review.userId, userId)),
    columns: { id: true },
  });
};

export const updateReview = async (id: string, data: Review) => {
  return await db
    .update(reviews)
    .set({ ...data })
    .where(eq(reviews.id, id))
    .returning();
};

export const createReview = async (
  data: Review & { userId: string; gameId: string },
) => {
  return await db
    .insert(reviews)
    .values({ ...data })
    .returning();
};

export const getReviewsByUserId = async (userId: string) => {
  return await db.query.reviews.findMany({
    where: (review, { eq, and }) =>
      and(eq(review.userId, userId), eq(review.active, true)),
    with: {
      game: {
        columns: { cover: true, name: true, releaseDate: true, slug: true },
      },
    },
    columns: { content: true, createdAt: true, isSpoiler: true, rating: true },
    orderBy: (review, { desc }) => [desc(review.createdAt)],
  });
};
