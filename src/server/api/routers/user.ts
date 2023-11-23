import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  addFollow,
  findFirstUserByUsername,
  findManyUsersByQuery,
  isFollowing,
  removeFollow,
} from "~/server/db";

export const userRouter = createTRPCRouter({
  findManyByQuery: publicProcedure
    .input(
      z.object({
        query: z.string(),
        limit: z.number().optional().default(10),
        cursor: z.number().optional().default(0),
      }),
    )
    .query(async ({ input }) => {
      const { query, limit, cursor } = input;
      const decodedQuery = decodeURI(query).trim();

      const users = (
        await findManyUsersByQuery({
          query: decodedQuery,
          offset: cursor,
          limit,
        })
      ).map((user) => ({
        username: user.username,
        profileImage: user.profileImage,
        coverImage: user.coverImage,
        followersCount: user.followers.length,
        followsCount: user.following.length,
      }));

      return { users, limit, nextCursor: cursor + limit };
    }),

  toggleFollow: protectedProcedure
    .meta({ description: "Toggle follow" })
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;
      const currentUserId = ctx.session.user.id;

      const isUserFollowing = await isFollowing(currentUserId, userId);

      if (isUserFollowing) {
        await removeFollow(currentUserId, userId);
        return { addedFollow: false };
      } else {
        await addFollow(currentUserId, userId);
        return { addedFollow: true };
      }
    }),
});
