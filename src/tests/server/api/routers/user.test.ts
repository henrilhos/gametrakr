import { type inferProcedureInput } from "@trpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter, type AppRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import * as db from "~/server/db";

vi.mock("~/server/db");

describe("user router", () => {
  describe("public procedures", async () => {
    const ctx = await createInnerTRPCContext({ session: null });
    const caller = appRouter.createCaller(ctx);

    describe("find many by query query", () => {
      type Input = inferProcedureInput<AppRouter["user"]["findManyByQuery"]>;
      const input: Input = { query: "gametrakr" };

      beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(db.findManyUsersByQuery).mockResolvedValue([
          {
            active: true,
            bio: null,
            coverImage: null,
            createdAt: new Date(),
            email: "hello@gametra.kr",
            followers: [],
            following: [],
            id: "42",
            location: null,
            password: "super-secret-password",
            profileImage: null,
            updatedAt: new Date(),
            username: "gametrakr",
            verified: true,
          },
        ]);
      });

      it("should return a list of users", async () => {
        const response = await caller.user.findManyByQuery(input);

        expect(response.users).toHaveLength(1);
        expect(response.users[0]).toStrictEqual({
          username: "gametrakr",
          profileImage: null,
          coverImage: null,
          followersCount: 0,
          followsCount: 0,
        });
        expect(response.limit).toBe(10);
        expect(response.nextCursor).toBe(10);
      });

      it("should have pagination and limit", async () => {
        const response = await caller.user.findManyByQuery({
          ...input,
          limit: 5,
          cursor: 15,
        });

        expect(response.limit).toBe(5);
        expect(response.nextCursor).toBe(20);
      });
    });

    describe("find first by username query", () => {
      type Input = inferProcedureInput<
        AppRouter["user"]["findFirstByUsername"]
      >;
      const input: Input = { username: "gametrakr" };

      const user = {
        bio: null,
        coverImage: null,
        createdAt: new Date(),
        id: "42",
        location: null,
        profileImage: null,
        username: "gametrakr",
      };

      beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(db.findFirstUserByUsername).mockResolvedValue(user);
        vi.mocked(db.getFollowersById).mockResolvedValue([]);
        vi.mocked(db.getFollowsById).mockResolvedValue([]);
      });

      it("should return undefined if not found any user", async () => {
        vi.mocked(db.findFirstUserByUsername).mockResolvedValue(undefined);
        const response = await caller.user.findFirstByUsername(input);

        expect(response).toBeUndefined();
        expect(db.findFirstUserByUsername).toBeCalledWith("gametrakr");
        expect(db.getFollowersById).toBeCalledTimes(0);
        expect(db.getFollowsById).toBeCalledTimes(0);
      });

      it("should return an user", async () => {
        const response = await caller.user.findFirstByUsername(input);

        expect(response).toStrictEqual({
          ...user,
          following: [],
          followers: [],
          isFollowing: false,
        });
        expect(db.findFirstUserByUsername).toBeCalledWith("gametrakr");
        expect(db.getFollowersById).toBeCalledWith("42", undefined);
        expect(db.getFollowsById).toBeCalledWith("42", undefined);
      });
    });

    it("should throw error when calling toggle follow mutation", async () => {
      let error;
      try {
        await caller.user.toggleFollow({ userId: "21" });
      } catch (err) {
        error = err;
      }

      expect(error).toContain(/UNAUTHORIZED/);
    });

    it("should throw error when calling toggle follow mutation", async () => {
      let error;
      try {
        await caller.user.updatePersonalInformation({});
      } catch (err) {
        error = err;
      }

      expect(error).toContain(/UNAUTHORIZED/);
    });
  });

  describe("protected procedures", async () => {
    const session = { user: { id: "42", username: "henrilhos" }, expires: "1" };
    const ctx = await createInnerTRPCContext({ session });
    const caller = appRouter.createCaller(ctx);

    describe("toggle follow mutation", () => {
      beforeEach(() => {
        vi.clearAllMocks();
      });

      it("should remove follow", async () => {
        vi.mocked(db.isFollowing).mockResolvedValue(true);

        const response = await caller.user.toggleFollow({ userId: "21" });

        expect(response).toStrictEqual({ addedFollow: false });
        expect(db.isFollowing).toBeCalledWith("42", "21");
        expect(db.removeFollow).toBeCalledWith("42", "21");
        expect(db.addFollow).toBeCalledTimes(0);
      });

      it("should add follow", async () => {
        vi.mocked(db.isFollowing).mockResolvedValue(false);

        const response = await caller.user.toggleFollow({ userId: "21" });

        expect(response).toStrictEqual({ addedFollow: true });
        expect(db.isFollowing).toBeCalledWith("42", "21");
        expect(db.addFollow).toBeCalledWith("42", "21");
        expect(db.removeFollow).toBeCalledTimes(0);
      });
    });

    describe("update personal information mutation", () => {
      type Input = inferProcedureInput<
        AppRouter["user"]["updatePersonalInformation"]
      >;
      const input: Input = { bio: "nice bio", location: "hyrule" };

      const user = { bio: "nice bio", location: "hyrule" };

      beforeEach(() => {
        vi.clearAllMocks();
      });

      it("should update personal info", async () => {
        vi.mocked(db.updateUserPersonalInformation).mockResolvedValue(user);

        const response = await caller.user.updatePersonalInformation(input);

        expect(response).toStrictEqual({ ...input });
        expect(db.updateUserPersonalInformation).toBeCalledWith("42", {
          ...input,
        });
      });
    });
  });
});
