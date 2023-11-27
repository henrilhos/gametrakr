import { type inferProcedureInput } from "@trpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter, type AppRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import * as db from "~/server/db";

vi.mock("~/server/db");

describe("review router", async () => {
  const session = { user: { id: "42", username: "henrilhos" }, expires: "1" };
  const ctx = await createInnerTRPCContext({ session });
  const caller = appRouter.createCaller(ctx);

  describe("create or update mutation", () => {
    const inputReview = {
      content: "i love this game",
      isSpoiler: false,
      rating: 10,
    };
    const review = {
      ...inputReview,
      active: true,
      createdAt: new Date(),
      gameId: "2000",
      id: "1996",
      updatedAt: new Date(),
      userId: "42",
    };

    type Input = inferProcedureInput<AppRouter["review"]["createOrUpdate"]>;
    const input: Input = {
      gameId: "2000",
      review: inputReview,
    };

    beforeEach(() => {
      vi.resetAllMocks();
      vi.mocked(db.createOrUpdateReview).mockResolvedValue([review]);
    });

    it("should create or update a review", async () => {
      const response = await caller.review.createOrUpdate(input);

      expect(response).toStrictEqual(review);
      expect(db.createOrUpdateReview).toHaveBeenLastCalledWith({
        ...inputReview,
        userId: "42",
        gameId: "2000",
      });
    });
  });
});
