import {
  and,
  count,
  desc,
  eq,
  exists,
  or,
  sql,
} from "drizzle-orm";
import type { AnyColumn } from "drizzle-orm";
import { db } from "~/server/db/db";
import { follows, games, reviews, users } from "~/server/db/schema";

const PAGE_SIZE = 20;
const CURSOR_VERSION = 1;

export type PublicProfileSection = "reviews" | "followers" | "following";

type Cursor = {
  version: typeof CURSOR_VERSION;
  profileId: string;
  section: PublicProfileSection;
  createdAt: string;
  id: string;
};

export class PublicProfileCursorError extends Error {
  constructor() {
    super("Invalid public profile cursor");
    this.name = "PublicProfileCursorError";
  }
}

const encodeCursor = (cursor: Omit<Cursor, "version">) =>
  Buffer.from(
    JSON.stringify({ ...cursor, version: CURSOR_VERSION }),
    "utf8",
  ).toString("base64url");

const decodeCursor = (
  value: string | undefined,
  profileId: string,
  section: PublicProfileSection,
) => {
  if (value === undefined) return undefined;

  try {
    const parsed: unknown = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    );

    if (!parsed || typeof parsed !== "object") throw new Error();
    const cursor = parsed as Partial<Cursor>;
    const date = cursor.createdAt ? new Date(cursor.createdAt) : undefined;

    if (
      cursor.version !== CURSOR_VERSION ||
      cursor.profileId !== profileId ||
      cursor.section !== section ||
      typeof cursor.id !== "string" ||
      !cursor.id ||
      !date ||
      Number.isNaN(date.getTime())
    ) {
      throw new Error();
    }

    return { id: cursor.id, createdAt: date };
  } catch {
    throw new PublicProfileCursorError();
  }
};

const pageCursor = (
  profileId: string,
  section: PublicProfileSection,
  item: { id: string; createdAt: Date },
) =>
  encodeCursor({
    profileId,
    section,
    id: item.id,
    createdAt: item.createdAt.toISOString(),
  });

const afterCursor = (
  createdAtColumn: AnyColumn,
  idColumn: AnyColumn,
  cursor: { id: string; createdAt: Date } | undefined,
) => {
  if (!cursor) return undefined;

  return or(
    sql`${createdAtColumn} < ${cursor.createdAt.toISOString()}`,
    and(
      sql`${createdAtColumn} = ${cursor.createdAt.toISOString()}`,
      sql`${idColumn} < ${cursor.id}`,
    ),
  );
};

type Database = typeof db;

export type PublicProfileReview = {
  id: string;
  rating: number | null;
  content: string | null;
  isSpoiler: boolean;
  createdAt: Date;
  game: {
    id: string;
    slug: string;
    name: string;
    cover: string | null;
    releaseDate: Date | null;
  };
};

export type PublicProfileFollow = {
  id: string;
  username: string;
  bio: string | null;
  profileImage: string | null;
  viewerRelationship: PublicProfileViewerRelationship;
};

export type PublicProfileViewerRelationship =
  | "owner"
  | "following"
  | "not-following"
  | "visitor";

export type PublicProfilePage<T> = {
  items: T[];
  nextCursor: string | null;
};

const getViewerRelationship = ({
  viewerId,
  profileId,
  isFollowing,
}: {
  viewerId?: string;
  profileId: string;
  isFollowing: boolean;
}): PublicProfileViewerRelationship => {
  if (!viewerId) return "visitor";
  if (viewerId === profileId) return "owner";
  return isFollowing ? "following" : "not-following";
};

export const createPublicProfileReader = (database: Database) => {
  const findProfile = (username: string) =>
    database.query.users.findFirst({
      where: (user, { and, eq }) =>
        and(eq(user.username, username), eq(user.active, true)),
      columns: {
        id: true,
        username: true,
        bio: true,
        location: true,
        profileImage: true,
        coverImage: true,
      },
    });

  const getReviewsPage = async ({
    profileId,
    cursor,
  }: {
    profileId: string;
    cursor?: string;
  }): Promise<PublicProfilePage<PublicProfileReview>> => {
    const decoded = decodeCursor(cursor, profileId, "reviews");
    const rows = await database
      .select({
        id: reviews.id,
        rating: reviews.rating,
        content: reviews.content,
        isSpoiler: reviews.isSpoiler,
        createdAt: reviews.createdAt,
        game: {
          id: games.id,
          slug: games.slug,
          name: games.name,
          cover: games.cover,
          releaseDate: games.releaseDate,
        },
      })
      .from(reviews)
      .innerJoin(games, eq(games.id, reviews.gameId))
      .where(
        and(
          eq(reviews.userId, profileId),
          eq(reviews.active, true),
          afterCursor(reviews.createdAt, reviews.id, decoded),
        ),
      )
      .orderBy(desc(reviews.createdAt), desc(reviews.id))
      .limit(PAGE_SIZE + 1);

    const hasNextPage = rows.length > PAGE_SIZE;
    const items = rows.slice(0, PAGE_SIZE);
    const last = items.at(-1);

    return {
      items,
      nextCursor:
        hasNextPage && last
          ? pageCursor(profileId, "reviews", last)
          : null,
    };
  };

  const getFollowsPage = async ({
    profileId,
    viewerId,
    section,
    cursor,
  }: {
    profileId: string;
    viewerId?: string;
    section: "followers" | "following";
    cursor?: string;
  }): Promise<PublicProfilePage<PublicProfileFollow>> => {
    const decoded = decodeCursor(cursor, profileId, section);
    const relationshipColumn =
      section === "followers" ? follows.followedUserId : follows.followingUserId;
    const listedUserColumn =
      section === "followers" ? follows.followingUserId : follows.followedUserId;
    const viewerFollowsListedUser = viewerId
      ? exists(
          database
            .select({ id: follows.followingUserId })
            .from(follows)
            .where(
              and(
                eq(follows.followingUserId, viewerId),
                eq(follows.followedUserId, users.id),
              ),
            ),
        ).mapWith(Boolean)
      : sql<boolean>`false`;

    const rows = await database
      .select({
        id: users.id,
        username: users.username,
        bio: users.bio,
        profileImage: users.profileImage,
        viewerFollowsListedUser,
        createdAt: follows.createdAt,
      })
      .from(follows)
      .innerJoin(users, eq(users.id, listedUserColumn))
      .where(
        and(
          eq(relationshipColumn, profileId),
          eq(users.active, true),
          afterCursor(follows.createdAt, users.id, decoded),
        ),
      )
      .orderBy(desc(follows.createdAt), desc(users.id))
      .limit(PAGE_SIZE + 1);

    const hasNextPage = rows.length > PAGE_SIZE;
    const items = rows.slice(0, PAGE_SIZE).map(
      ({ createdAt: _createdAt, viewerFollowsListedUser, id, ...item }) => ({
        id,
        ...item,
        viewerRelationship: getViewerRelationship({
          viewerId,
          profileId: id,
          isFollowing: viewerFollowsListedUser,
        }),
      }),
    );
    const last = rows.at(PAGE_SIZE - 1);

    return {
      items,
      nextCursor:
        hasNextPage && last
          ? pageCursor(profileId, section, { id: last.id, createdAt: last.createdAt })
          : null,
    };
  };

  const getOverview = async ({
    username,
    viewerId,
  }: {
    username: string;
    viewerId?: string;
  }) => {
    const profile = await findProfile(username);
    if (!profile) return undefined;

    const viewerFollowsProfile = viewerId
      ? exists(
          database
            .select({ id: follows.followingUserId })
            .from(follows)
            .where(
              and(
                eq(follows.followingUserId, viewerId),
                eq(follows.followedUserId, profile.id),
              ),
            ),
        ).mapWith(Boolean)
      : sql<boolean>`false`;

    const [counts, reviewsPage, relationship] = await Promise.all([
      database
        .select({
          followersCount: count(
            sql`case when ${users.active} and ${follows.followedUserId} = ${profile.id} then ${follows.followingUserId} end`,
          ).mapWith(Number),
          followingCount: count(
            sql`case when ${users.active} and ${follows.followingUserId} = ${profile.id} then ${follows.followedUserId} end`,
          ).mapWith(Number),
        })
        .from(users)
        .leftJoin(
          follows,
          or(
            and(
              eq(follows.followedUserId, profile.id),
              eq(follows.followingUserId, users.id),
            ),
            and(
              eq(follows.followingUserId, profile.id),
              eq(follows.followedUserId, users.id),
            ),
          ),
        )
        .where(eq(users.active, true)),
      getReviewsPage({ profileId: profile.id }),
      database
        .select({ viewerFollowsProfile })
        .from(users)
        .where(eq(users.id, profile.id)),
    ]);

    return {
      ...profile,
      followersCount: counts[0]?.followersCount ?? 0,
      followingCount: counts[0]?.followingCount ?? 0,
      viewerRelationship: getViewerRelationship({
        viewerId,
        profileId: profile.id,
        isFollowing: relationship[0]?.viewerFollowsProfile ?? false,
      }),
      reviews: reviewsPage.items,
      nextCursor: reviewsPage.nextCursor,
    };
  };

  const getPage = async ({
    username,
    viewerId,
    section,
    cursor,
  }: {
    username: string;
    viewerId?: string;
    section: PublicProfileSection;
    cursor?: string;
  }) => {
    const profile = await findProfile(username);
    if (!profile) return undefined;

    if (section === "reviews") {
      return getReviewsPage({ profileId: profile.id, cursor });
    }

    return getFollowsPage({ profileId: profile.id, viewerId, section, cursor });
  };

  return { getOverview, getPage };
};

export const publicProfile = createPublicProfileReader(db);
