import { and, desc, eq, exists } from "drizzle-orm";
import { db } from "~/server/db";
import { follows, users } from "~/server/db/schema";

type NewFollow = typeof follows.$inferInsert;

export const createFollow = async (data: NewFollow) => {
  return await db.insert(follows).values(data);
};

export const getFollow = async (
  currentUserId: string,
  targetUserId: string,
) => {
  return await db.query.follows.findFirst({
    where: (follows, { eq, and }) =>
      and(
        eq(follows.followingUserId, currentUserId),
        eq(follows.followedUserId, targetUserId),
      ),
  });
};

export const deleteFollow = async (
  currentUserId: string,
  targetUserId: string,
) => {
  return await db
    .delete(follows)
    .where(
      and(
        eq(follows.followingUserId, currentUserId),
        eq(follows.followedUserId, targetUserId),
      ),
    );
};

export const getFollowing = async (id: string, currentUserId?: string) => {
  return await db
    .select({
      id: users.id,
      username: users.username,
      profileImage: users.profileImage,
      bio: users.bio,
      ...(currentUserId
        ? {
            isFollowing: exists(
              db
                .select()
                .from(follows)
                .where(
                  and(
                    eq(follows.followingUserId, currentUserId),
                    eq(follows.followedUserId, users.id),
                  ),
                ),
            ).mapWith(Boolean),
          }
        : {}),
    })
    .from(users)
    .leftJoin(follows, eq(follows.followingUserId, id))
    .where(eq(follows.followedUserId, users.id))
    .orderBy(desc(follows.createdAt));
};

export const getFollowers = async (id: string, currentUserId?: string) => {
  return await db
    .select({
      id: users.id,
      username: users.username,
      profileImage: users.profileImage,
      bio: users.bio,
      ...(currentUserId
        ? {
            isFollowing: exists(
              db
                .select()
                .from(follows)
                .where(
                  and(
                    eq(follows.followingUserId, currentUserId),
                    eq(follows.followedUserId, users.id),
                  ),
                ),
            ).mapWith(Boolean),
          }
        : {}),
    })
    .from(users)
    .leftJoin(follows, eq(follows.followedUserId, id))
    .where(eq(follows.followingUserId, users.id))
    .orderBy(desc(follows.createdAt));
};
