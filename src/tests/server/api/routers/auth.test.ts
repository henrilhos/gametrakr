import { NextRequest } from "next/server";
import { type inferProcedureInput, type TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as utils from "~/lib/utils";
import { appRouter, type AppRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import * as db from "~/server/db";

vi.mock("~/lib/utils");
vi.mock("~/server/auth");
vi.mock("~/server/db");
vi.mock("~/server/emails");
vi.mock("resend");

describe("auth router", async () => {
  const req = new NextRequest("https://gametra.kr");
  const ctx = await createInnerTRPCContext(req);
  const caller = appRouter.createCaller(ctx);

  describe("sign up mutation", () => {
    type Input = inferProcedureInput<AppRouter["auth"]["signUp"]>;
    const input: Input = {
      confirmPassword: "1234@asdf",
      password: "1234@asdf",
      email: "hello@gametra.kr",
      username: "gametrakr",
    };

    const user = { id: "42" };

    beforeEach(() => {
      vi.resetAllMocks();
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
      let message;
      vi.mocked(utils.passwordMatches).mockReturnValue(false);

      try {
        await caller.auth.signUp(input);
      } catch (err) {
        message = (err as TRPCError).message;
      }

      expect(message).toBe("Passwords don't match");
    });

    it("should throw user already exists error", async () => {
      let message;
      vi.mocked(db.canCreateUser).mockResolvedValue(false);

      try {
        await caller.auth.signUp(input);
      } catch (err) {
        message = (err as TRPCError).message;
      }

      expect(message).toBe("User already exists");
    });

    it("should throw user already exists error", async () => {
      let message;
      vi.mocked(db.createUser).mockResolvedValue([]);

      try {
        await caller.auth.signUp(input);
      } catch (err) {
        message = (err as TRPCError).message;
      }

      expect(message).toBe("User not created");
    });

    it("should throw token not created error", async () => {
      let message;
      vi.mocked(db.createAccountToken).mockResolvedValue([]);

      try {
        await caller.auth.signUp(input);
      } catch (err) {
        message = (err as TRPCError).message;
      }

      expect(message).toBe("Token not created");
    });

    it("should call all mocked functions and return created user id", async () => {
      const user = await caller.auth.signUp(input);

      expect(user.id).toBe("42");
      expect(utils.passwordMatches).toHaveBeenLastCalledWith(
        "1234@asdf",
        "1234@asdf",
      );
      expect(db.canCreateUser).toHaveBeenLastCalledWith({
        email: input.email,
        username: input.username,
      });
      expect(db.createUser).toHaveBeenLastCalledWith({
        email: input.email,
        username: input.username,
        password: input.password,
      });
    });
  });

  describe("resend account verification email mutation", () => {
    type Input = inferProcedureInput<
      AppRouter["auth"]["resendAccountVerificationEmail"]
    >;
    const input: Input = { email: "hello@gametra.kr" };

    beforeEach(() => {
      vi.resetAllMocks();
      vi.mocked(db.getUserIdByEmail).mockResolvedValue("42");
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

    it("should throw user not exists error", async () => {
      let message;
      vi.mocked(db.getUserIdByEmail).mockResolvedValue(undefined);

      try {
        await caller.auth.resendAccountVerificationEmail(input);
      } catch (err) {
        message = (err as TRPCError).message;
      }

      expect(message).toBe("User not exists");
    });

    it("should throw token not created error", async () => {
      let message;
      vi.mocked(db.createAccountToken).mockResolvedValue([]);

      try {
        await caller.auth.resendAccountVerificationEmail(input);
      } catch (err) {
        message = (err as TRPCError).message;
      }

      expect(message).toBe("Token not created");
    });

    it("should call all mocked functions and return success message", async () => {
      const response = await caller.auth.resendAccountVerificationEmail(input);

      expect(response.message).toBe("Email sent successfully");
      expect(db.getUserIdByEmail).toHaveBeenLastCalledWith({
        email: input.email,
      });
      expect(db.createAccountToken).toHaveBeenLastCalledWith({ userId: "42" });
    });
  });

  describe("confirm account mutation", () => {
    type Input = inferProcedureInput<AppRouter["auth"]["confirmAccount"]>;
    const input: Input = { email: "hello@gametra.kr", tokenId: "21" };

    beforeEach(() => {
      vi.resetAllMocks();
      vi.mocked(db.getUserByEmail).mockResolvedValue({
        active: true,
        createdAt: new Date(),
        email: "hello@gametra.kr",
        id: "42",
        password: "supersecretpassword",
        updatedAt: new Date(),
        username: "gametrakr",
        verified: false,
        bio: null,
        coverImage: null,
        location: null,
        profileImage: null,
      });
      vi.mocked(db.getAccountTokenByIdAndUserId).mockResolvedValue({
        createdAt: new Date(),
        id: "21",
        type: "account",
        updatedAt: new Date(),
        userId: "42",
        valid: true,
      });
    });

    it("should throw user not found error", async () => {
      let message;
      vi.mocked(db.getUserByEmail).mockResolvedValue(undefined);

      try {
        await caller.auth.confirmAccount(input);
      } catch (err) {
        message = (err as TRPCError).message;
      }

      expect(message).toBe("User not found");
    });

    it("should throw user already verified error", async () => {
      let message;
      vi.mocked(db.getUserByEmail).mockResolvedValue({
        active: true,
        createdAt: new Date(),
        email: "hello@gametra.kr",
        id: "42",
        password: "supersecretpassword",
        updatedAt: new Date(),
        username: "gametrakr",
        verified: true,
        bio: null,
        coverImage: null,
        location: null,
        profileImage: null,
      });

      try {
        await caller.auth.confirmAccount(input);
      } catch (err) {
        message = (err as TRPCError).message;
      }

      expect(message).toBe("User already verified");
    });

    it("should throw token not found error", async () => {
      let message;
      vi.mocked(db.getAccountTokenByIdAndUserId).mockResolvedValue(undefined);

      try {
        await caller.auth.confirmAccount(input);
      } catch (err) {
        message = (err as TRPCError).message;
      }

      expect(message).toBe("Token not found");
    });

    it("should call all mocked functions and return success message", async () => {
      const response = await caller.auth.confirmAccount(input);

      expect(response.message).toBe("Account verified successfully");
      expect(db.getUserByEmail).toHaveBeenLastCalledWith({
        email: input.email,
      });
      expect(db.getAccountTokenByIdAndUserId).toHaveBeenLastCalledWith({
        tokenId: "21",
        userId: "42",
      });
      expect(db.invalidateTokens).toHaveBeenLastCalledWith({
        userId: "42",
        tokenType: "account",
      });
      expect(db.verifyUser).toHaveBeenLastCalledWith({ id: "42" });
    });
  });

  describe("confirm account mutation", () => {
    type Input = inferProcedureInput<
      AppRouter["auth"]["sendResetPasswordEmail"]
    >;
    const input: Input = { credential: "gametrakr" };

    beforeEach(() => {
      vi.resetAllMocks();
      vi.mocked(db.getUserByCredential).mockResolvedValue({
        active: true,
        createdAt: new Date(),
        email: "hello@gametra.kr",
        id: "42",
        password: "supersecretpassword",
        updatedAt: new Date(),
        username: "gametrakr",
        verified: true,
        bio: null,
        coverImage: null,
        location: null,
        profileImage: null,
      });
      vi.mocked(db.createPasswordToken).mockResolvedValue([
        {
          createdAt: new Date(),
          id: "12",
          type: "password",
          updatedAt: new Date(),
          userId: "42",
          valid: true,
        },
      ]);
    });

    it("should throw user not exists error", async () => {
      let message;
      vi.mocked(db.getUserByCredential).mockResolvedValue(undefined);

      try {
        await caller.auth.sendResetPasswordEmail(input);
      } catch (err) {
        message = (err as TRPCError).message;
      }

      expect(message).toBe("User not exists");
    });

    it("should throw token not created error", async () => {
      let message;
      vi.mocked(db.createPasswordToken).mockResolvedValue([]);

      try {
        await caller.auth.sendResetPasswordEmail(input);
      } catch (err) {
        message = (err as TRPCError).message;
      }

      expect(message).toBe("Token not created");
    });

    it("should call all mocked functions and return success message", async () => {
      const response = await caller.auth.sendResetPasswordEmail(input);

      expect(response.email).toBe("hello@gametra.kr");
      expect(db.getUserByCredential).toHaveBeenLastCalledWith({
        credential: input.credential,
      });
      expect(db.createPasswordToken).toHaveBeenLastCalledWith({ userId: "42" });
    });
  });

  describe("confirm account mutation", () => {
    type Input = inferProcedureInput<AppRouter["auth"]["resetPassword"]>;
    const input: Input = {
      email: "hello@gametra.kr",
      token: "12",
      confirmPassword: "asdf@1234",
      password: "asdf@1234",
    };

    beforeEach(() => {
      vi.resetAllMocks();
      vi.mocked(utils.passwordMatches).mockReturnValue(true);
      vi.mocked(db.getUserByEmail).mockResolvedValue({
        active: true,
        createdAt: new Date(),
        email: "hello@gametra.kr",
        id: "42",
        password: "supersecretpassword",
        updatedAt: new Date(),
        username: "gametrakr",
        verified: false,
        bio: null,
        coverImage: null,
        location: null,
        profileImage: null,
      });
      vi.mocked(db.getPasswordTokenByIdAndUserId).mockResolvedValue({
        createdAt: new Date(),
        id: "12",
        type: "password",
        updatedAt: new Date(),
        userId: "42",
        valid: true,
      });
    });

    it("should throw passwords don't match error", async () => {
      let message;
      vi.mocked(utils.passwordMatches).mockReturnValue(false);

      try {
        await caller.auth.resetPassword(input);
      } catch (err) {
        message = (err as TRPCError).message;
      }

      expect(message).toBe("Passwords don't match");
    });

    it("should throw user not found error", async () => {
      let message;
      vi.mocked(db.getUserByEmail).mockResolvedValue(undefined);

      try {
        await caller.auth.resetPassword(input);
      } catch (err) {
        message = (err as TRPCError).message;
      }

      expect(message).toBe("User not found");
    });

    it("should throw token not found error", async () => {
      let message;
      vi.mocked(db.getPasswordTokenByIdAndUserId).mockResolvedValue(undefined);

      try {
        await caller.auth.resetPassword(input);
      } catch (err) {
        message = (err as TRPCError).message;
      }

      expect(message).toBe("Token not found");
    });

    it("should call all mocked functions and return success message", async () => {
      const response = await caller.auth.resetPassword(input);

      expect(response.message).toBe("Email sent successfully");
      expect(utils.passwordMatches).toHaveBeenLastCalledWith(
        "asdf@1234",
        "asdf@1234",
      );
      expect(db.getUserByEmail).toHaveBeenLastCalledWith({
        email: input.email,
      });
      expect(db.getPasswordTokenByIdAndUserId).toHaveBeenLastCalledWith({
        tokenId: "12",
        userId: "42",
      });
      expect(db.invalidateTokens).toHaveBeenLastCalledWith({
        userId: "42",
        tokenType: "password",
      });
      expect(db.updateUserPassword).toHaveBeenLastCalledWith({
        userId: "42",
        password: "asdf@1234",
      });
    });
  });
});
