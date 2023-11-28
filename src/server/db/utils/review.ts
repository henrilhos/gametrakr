import { eq } from "drizzle-orm";
import { type ReviewSchemaType } from "~/server/api/schemas/review";
import { db } from "~/server/db/db";
import { reviews } from "~/server/db/schema";

export const createOrUpdateReview = async (
  data: { gameId: string; userId: string } & ReviewSchemaType,
) => {
  const exists = await db.query.reviews.findFirst({
    where: (reviews, { eq, and }) =>
      and(eq(reviews.gameId, data.gameId), eq(reviews.userId, data.userId)),
    columns: { id: true },
  });

  if (!exists) {
    return db
      .insert(reviews)
      .values({ ...data })
      .returning();
  }

  return db
    .update(reviews)
    .set({ ...data })
    .where(eq(reviews.id, exists.id))
    .returning();
};
