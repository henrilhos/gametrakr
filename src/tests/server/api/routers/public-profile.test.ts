import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import * as auth from "~/server/auth";
import * as db from "~/server/db";

vi.mock("~/server/auth");
vi.mock("~/server/db");

describe("public profile router", () => {
  const createCaller = async () =>
    appRouter.createCaller(
      await createInnerTRPCContext(
        new NextRequest("https://gametra.kr/profile-owner"),
      ),
    );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth.getServerAuthSession).mockResolvedValue(null);
  });

  it("passes the visitor identity to the overview projection", async () => {
    vi.mocked(db.publicProfile.getOverview).mockResolvedValue({
      id: "profile-id",
      username: "profile-owner",
      bio: null,
      location: null,
      profileImage: null,
      coverImage: null,
      followersCount: 0,
      followingCount: 0,
      viewerRelationship: "visitor",
      reviews: [],
      nextCursor: null,
    });

    const response = await (await createCaller()).publicProfile.overview({
      username: "profile-owner",
    });

    expect(response?.viewerRelationship).toBe("visitor");
    expect(db.publicProfile.getOverview).toHaveBeenCalledWith({
      username: "profile-owner",
      viewerId: undefined,
    });
  });

  it("translates invalid cursors into a transport error", async () => {
    vi.mocked(db.publicProfile.getPage).mockRejectedValue(
      new db.PublicProfileCursorError(),
    );

    await expect(
      (await createCaller()).publicProfile.reviews({
        username: "profile-owner",
        cursor: "invalid",
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
