import { describe, expect, it } from "vitest";
import {
  createPublicProfileReader,
  PublicProfileCursorError,
} from "~/server/db/utils/public-profile";
import { follows, reviews } from "~/server/db/schema";
import { getTestDatabase } from "./database";
import { createGameFixture, createUserFixture } from "./fixtures";

const publicProfile = () => createPublicProfileReader(getTestDatabase());

describe("public profile reads", () => {
  it("returns the public projection, exact counts, and viewer relationship", async () => {
    const owner = await createUserFixture({
      email: "profile-owner@example.com",
      username: "profile-owner",
    });
    const follower = await createUserFixture({
      email: "profile-follower@example.com",
      username: "profile-follower",
    });
    const following = await createUserFixture({
      email: "profile-following@example.com",
      username: "profile-following",
    });
    const inactive = await createUserFixture({
      active: false,
      email: "inactive@example.com",
      username: "inactive-follower",
    });
    const game = await createGameFixture();

    await getTestDatabase().insert(follows).values([
      { followingUserId: follower.id, followedUserId: owner.id },
      { followingUserId: owner.id, followedUserId: following.id },
      { followingUserId: inactive.id, followedUserId: owner.id },
    ]);
    await getTestDatabase().insert(reviews).values({
      userId: owner.id,
      gameId: game.id,
      rating: 8,
      content: "A public review",
    });

    const result = await publicProfile().getOverview({
      username: owner.username,
      viewerId: follower.id,
    });

    expect(result).toMatchObject({
      id: owner.id,
      username: "profile-owner",
      followersCount: 1,
      followingCount: 1,
      isFollowing: true,
      reviews: [
        {
          rating: 8,
          content: "A public review",
          isSpoiler: false,
          game: { id: game.id, slug: game.slug, name: game.name },
        },
      ],
      nextCursor: null,
    });
    expect(result).not.toHaveProperty("email");
    expect(result).not.toHaveProperty("password");
    expect(result).not.toHaveProperty("active");
    expect(result).not.toHaveProperty("createdAt");
  });

  it("paginates reviews with a stable keyset and rejects wrong cursors", async () => {
    const owner = await createUserFixture({
      email: "paged-owner@example.com",
      username: "paged-owner",
    });
    const other = await createUserFixture({
      email: "other-owner@example.com",
      username: "other-owner",
    });

    for (let index = 0; index < 21; index += 1) {
      const game = await createGameFixture({
        name: `Game ${index}`,
        slug: `game-${index}`,
      });
      await getTestDatabase().insert(reviews).values({
        userId: owner.id,
        gameId: game.id,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      });
    }

    const first = await publicProfile().getPage({
      username: owner.username,
      section: "reviews",
    });
    if (!first) throw new Error("Profile fixture was not found");

    expect(first.items).toHaveLength(20);
    expect(first.nextCursor).toEqual(expect.any(String));

    const second = await publicProfile().getPage({
      username: owner.username,
      section: "reviews",
      cursor: first.nextCursor ?? undefined,
    });
    if (!second) throw new Error("Profile fixture was not found");

    expect(second.items).toHaveLength(1);
    expect(
      new Set([...first.items, ...second.items].map((review) => review.id)),
    ).toHaveLength(21);

    await expect(
      publicProfile().getPage({
        username: owner.username,
        section: "followers",
        cursor: first.nextCursor ?? undefined,
      }),
    ).rejects.toBeInstanceOf(PublicProfileCursorError);

    await expect(
      publicProfile().getPage({
        username: other.username,
        section: "reviews",
        cursor: first.nextCursor ?? undefined,
      }),
    ).rejects.toBeInstanceOf(PublicProfileCursorError);
  });
});
