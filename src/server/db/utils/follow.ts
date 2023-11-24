import { and, eq, exists } from "drizzle-orm";
import { db } from "~/server/db/db";
import { follows, users } from "~/server/db/schema";

export const isFollowing = async (
  currentUserId: string,
  targetUserId: string,
) => {
  const follow = await db.query.follows.findFirst({
    where: (follows, { eq, and }) =>
      and(
        eq(follows.followingUserId, currentUserId),
        eq(follows.followedUserId, targetUserId),
      ),
  });

  return Boolean(follow);
};

export const addFollow = async (
  currentUserId: string,
  targetUserId: string,
) => {
  await db.insert(follows).values({
    followingUserId: currentUserId,
    followedUserId: targetUserId,
  });
};

export const removeFollow = async (
  currentUserId: string,
  targetUserId: string,
) => {
  await db
    .delete(follows)
    .where(
      and(
        eq(follows.followingUserId, currentUserId),
        eq(follows.followedUserId, targetUserId),
      ),
    );
};

export const getFollowsById = (id: string, currentUserId?: string) => {
  return db
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
    .where(eq(follows.followedUserId, users.id));
};

export const getFollowersById = (id: string, currentUserId?: string) => {
  return db
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
    .where(eq(follows.followingUserId, users.id));
};
