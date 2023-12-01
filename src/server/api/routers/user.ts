import { z } from "zod";
import { UserPersonalInfoSchema } from "~/server/api/schemas/user";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import * as dbUtils from "~/server/db/utils";

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
        await dbUtils.findManyUsersByQuery({
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

      const isUserFollowing = Boolean(
        await dbUtils.getFollow(currentUserId, userId),
      );

      if (isUserFollowing) {
        await dbUtils.deleteFollow(currentUserId, userId);
        return { addedFollow: false };
      } else {
        await dbUtils.createFollow({
          followedUserId: userId,
          followingUserId: currentUserId,
        });
        return { addedFollow: true };
      }
    }),

  findFirstByUsername: publicProcedure
    .meta({
      description: "Find user by username",
    })
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const { username } = input;
      const currentUserId = ctx.session?.user.id;

      const user = await dbUtils.findFirstUserByUsername(username);

      if (!user) return;

      const followers = await dbUtils.getFollowers(user.id, currentUserId);
      const following = await dbUtils.getFollowing(user.id, currentUserId);
      const reviews = await dbUtils.getReviewsByUserId(user.id);

      return {
        ...user,
        reviews,
        following,
        followers,
        isFollowing:
          followers.filter(({ id }) => id === currentUserId).length > 0,
      };
    }),

  updatePersonalInformation: protectedProcedure
    .meta({ description: "Update user basic information" })
    .input(UserPersonalInfoSchema)
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;
      const user = await dbUtils.updateUserPersonalInformation(
        currentUserId,
        input,
      );

      return { ...user };
    }),
});
