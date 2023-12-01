import { z } from "zod";
import { ReviewSchema } from "~/server/api/schemas/review";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import * as dbUtils from "~/server/db/utils";

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

      const reviewAlreadyExist = await dbUtils.getReviewIdByGameAndUserId(
        gameId,
        userId,
      );

      if (reviewAlreadyExist) {
        const [response] = await dbUtils.updateReview(reviewAlreadyExist.id, {
          ...review,
        });

        return response;
      }

      const [response] = await dbUtils.createReview({
        ...review,
        userId,
        gameId,
      });

      return response;
    }),
});
