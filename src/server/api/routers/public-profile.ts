import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  PublicProfileCursorError,
  publicProfile,
  type PublicProfileFollow,
  type PublicProfileReview,
} from "~/server/db";

const pageInput = z.object({
  username: z.string(),
  cursor: z.string().optional(),
});

const viewerId = (session: { user?: { id?: string } } | null) =>
  session?.user?.id;

const getPage = async (input: Parameters<typeof publicProfile.getPage>[0]) => {
  try {
    return await publicProfile.getPage(input);
  } catch (error) {
    if (error instanceof PublicProfileCursorError) {
      throw new TRPCError({ code: "BAD_REQUEST", cause: error });
    }
    throw error;
  }
};

export const publicProfileRouter = createTRPCRouter({
  overview: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(({ ctx, input }) =>
      publicProfile.getOverview({
        username: input.username,
        viewerId: viewerId(ctx.session),
      }),
    ),

  reviews: publicProcedure.input(pageInput).query(async ({ ctx, input }) => {
    const page = await getPage({
      ...input,
      section: "reviews",
      viewerId: viewerId(ctx.session),
    });

    return (
      page && {
        reviews: page.items as PublicProfileReview[],
        nextCursor: page.nextCursor,
      }
    );
  }),

  followers: publicProcedure.input(pageInput).query(async ({ ctx, input }) => {
    const page = await getPage({
      ...input,
      section: "followers",
      viewerId: viewerId(ctx.session),
    });

    return (
      page && {
        followers: page.items as PublicProfileFollow[],
        nextCursor: page.nextCursor,
      }
    );
  }),

  following: publicProcedure.input(pageInput).query(async ({ ctx, input }) => {
    const page = await getPage({
      ...input,
      section: "following",
      viewerId: viewerId(ctx.session),
    });

    return (
      page && {
        following: page.items as PublicProfileFollow[],
        nextCursor: page.nextCursor,
      }
    );
  }),
});
