import { TokenType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { hash } from "argon2";

import {
  forgotPasswordSchema,
  resendEmailSchema,
  resetPasswordSchema,
  signUpSchema,
  verifyAccountSchema,
} from "~/common/validation/auth";
import ConfirmAccount from "~/emails/confirm-account";
import ResetPassword from "~/emails/reset-password";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getBaseUrl } from "~/utils/get-base-url";
import { sendEmail } from "../../emails";

import type { User } from "@prisma/client";
import type { db as prismaDB } from "~/server/db";

type SendEmail = {
  to: string[];
  props: {
    href: string;
  };
};

const sendAccountEmail = async ({ to, props }: SendEmail) => {
  await sendEmail({
    subject: "Confirm your gametrakr account",
    to,
    react: ConfirmAccount({ ...props }),
  });
};

const sendPasswordEmail = async ({ to, props }: SendEmail) => {
  await sendEmail({
    subject: "Reset your gametrakr password",
    to,
    react: ResetPassword({ ...props }),
  });
};

type CreateTokenProps = {
  user: User;
  db: typeof prismaDB;
  type: TokenType;
};
const createAndSendToken = async ({ user, db, type }: CreateTokenProps) => {
  try {
    // Invalidate existing tokens
    await db.token.updateMany({
      where: { userId: user.id, type },
      data: { valid: false },
    });

    const token = await db.token.create({ data: { userId: user.id, type } });

    const url =
      type === TokenType.EMAIL
        ? `${getBaseUrl()}/auth/confirm-account`
        : `${getBaseUrl()}/auth/reset-password`;
    const props = { href: `${url}?token=${token.id}&email=${user.email}` };

    if (type === "EMAIL") {
      await sendAccountEmail({ to: [user.email], props });
    }
    if (type === "PASSWORD") {
      await sendPasswordEmail({ to: [user.email], props });
    }
  } catch (error) {
    throw error;
  }
};

const findUserByEmailOrUsername = (
  email: string,
  username: string,
  db: typeof prismaDB,
) =>
  db.user.findFirst({
    where: {
      OR: [
        { email: { equals: email, mode: "insensitive" } },
        { username: { equals: username, mode: "insensitive" } },
      ],
    },
  });

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .meta({ description: "Create a new user" })
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, password, username, confirmPassword } = input;

      if (password !== confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwords don't match",
        });
      }

      const exists = await findUserByEmailOrUsername(email, username, ctx.db);

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      const hashedPassword = await hash(password);

      const result = await ctx.db.user.create({
        data: {
          username,
          email: email.toLowerCase(),
          password: hashedPassword,
        },
      });

      await createAndSendToken({
        user: result,
        db: ctx.db,
        type: TokenType.EMAIL,
      });

      return {
        message: "User created successfully",
        data: result.id,
      };
    }),
  resendEmailVerification: publicProcedure
    .meta({ description: "Resend verification email link" })
    .input(resendEmailSchema)
    .mutation(async ({ ctx, input }) => {
      const { email } = input;

      const user = await ctx.db.user.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
      });

      if (!user) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User not found",
        });
      }

      await createAndSendToken({
        user,
        db: ctx.db,
        type: TokenType.EMAIL,
      });

      return { message: "Email sent successfully" };
    }),
  validateAccount: publicProcedure
    .meta({ description: "Validate user account" })
    .input(verifyAccountSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, type } = input;

      const token = await ctx.db.token.findFirst({
        where: { AND: [{ id }, { type }] },
        include: { user: true },
      });

      if (!token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Token not found",
        });
      }

      if (token?.user.verified) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User already verified",
        });
      }

      if (!token?.valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }

      await ctx.db.user.update({
        where: { id: token.user.id },
        data: { verified: true },
      });

      await ctx.db.token.update({
        where: { id: token.id },
        data: { valid: false },
      });

      return {
        message: "Account verified successfully",
      };
    }),
  forgotPassword: publicProcedure
    .meta({
      description: "Send reset passwork link",
    })
    .input(forgotPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { credential } = input;

      try {
        const user = await findUserByEmailOrUsername(
          credential,
          credential,
          ctx.db,
        );

        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        await createAndSendToken({
          user,
          db: ctx.db,
          type: TokenType.PASSWORD,
        });

        return { message: "Email sent successfully" };
      } catch (error) {
        throw error;
      }
    }),
  resetPassword: publicProcedure
    .meta({ description: "Reset user password" })
    .input(resetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, token: tokenId, password, confirmPassword } = input;

      try {
        const token = await ctx.db.token.findFirst({
          where: { AND: [{ id: tokenId, type: TokenType.PASSWORD }] },
          include: { user: true },
        });

        if (!token) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Token not found",
          });
        }

        if (!token.valid || token.user.email !== email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid token",
          });
        }

        if (password !== confirmPassword) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Passwords don't match",
          });
        }

        const hashedPassword = await hash(password);

        await ctx.db.token.update({
          where: { id: token.id },
          data: { valid: false },
        });

        const result = await ctx.db.user.update({
          where: { id: token.user.id },
          data: { password: hashedPassword },
        });

        return {
          message: "Password updated successfully",
          data: result.id,
        };
      } catch (error) {}
    }),
});
