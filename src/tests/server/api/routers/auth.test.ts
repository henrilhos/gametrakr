import { type inferProcedureInput, type TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as utils from "~/lib/utils";
import { appRouter, type AppRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import * as db from "~/server/db";

vi.mock("~/server/db");
vi.mock("~/lib/utils");
vi.mock("~/server/emails");

describe("auth router", async () => {
  const ctx = await createInnerTRPCContext({ session: null });
  const caller = appRouter.createCaller(ctx);

  type Input = inferProcedureInput<AppRouter["auth"]["signUp"]>;
  const input: Input = {
    confirmPassword: "1234@asdf",
    password: "1234@asdf",
    email: "hello@gametra.kr",
    username: "gametrakr",
  };

  const user = { id: "42" };

  beforeEach(() => {
    vi.mocked(utils.passwordMatches).mockReturnValue(true);
    vi.mocked(db.canCreateUser).mockResolvedValue(true);
    vi.mocked(db.createUser).mockResolvedValue([user]);
    vi.mocked(db.createAccountToken).mockResolvedValue([
      {
        createdAt: new Date(),
        id: "21",
        type: "account",
        updatedAt: new Date(),
        userId: "42",
        valid: true,
      },
    ]);
  });

  it("should throw password don't match error", async () => {
    vi.mocked(utils.passwordMatches).mockReturnValue(false);

    try {
      await caller.auth.signUp(input);
    } catch (err) {
      const { message } = err as TRPCError;
      expect(message).toBe("Passwords don't match");
    }
  });

  it("should throw user already exists error", async () => {
    vi.mocked(db.canCreateUser).mockResolvedValue(false);

    try {
      await caller.auth.signUp(input);
    } catch (err) {
      const { message } = err as TRPCError;
      expect(message).toBe("User already exists");
    }
  });

  it("should throw user already exists error", async () => {
    vi.mocked(db.createUser).mockResolvedValue([]);

    try {
      await caller.auth.signUp(input);
    } catch (err) {
      const { message } = err as TRPCError;
      expect(message).toBe("User not created");
    }
  });

  it("should throw token not created error", async () => {
    vi.mocked(db.createAccountToken).mockResolvedValue([]);

    try {
      await caller.auth.signUp(input);
    } catch (err) {
      const { message } = err as TRPCError;
      expect(message).toBe("Token not created");
    }
  });

  it("should call all mocked functions and return created user id", async () => {
    const user = await caller.auth.signUp(input);

    expect(user.id).toBe("42");
    expect(utils.passwordMatches).toHaveBeenCalledWith(
      "1234@asdf",
      "1234@asdf",
    );
    expect(db.canCreateUser).toHaveBeenCalledWith({
      email: input.email,
      username: input.username,
    });
    expect(db.createUser).toHaveBeenCalledWith({
      email: input.email,
      username: input.username,
      password: input.password,
    });
  });
});
