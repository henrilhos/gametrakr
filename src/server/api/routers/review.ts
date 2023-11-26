import { z } from "zod";
import { ReviewSchema } from "~/server/api/schemas/review";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createOrUpdateReview } from "~/server/db";

export const reviewRouter = createTRPCRouter({
  createOrUpdate: protectedProcedure
    .input(
      z.object({
        gameId: z.string(),
        review: ReviewSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { gameId, review } = input;

      const [response] = await createOrUpdateReview({
        ...review,
        userId,
        gameId,
      });
      return response;
    }),
});
