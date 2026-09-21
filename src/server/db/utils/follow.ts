import { and, eq } from "drizzle-orm";
import { db } from "~/server/db/db";
import { follows } from "~/server/db/schema";

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
