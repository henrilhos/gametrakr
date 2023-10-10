import { TokenType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { Resend } from "resend";
import { randomUUID } from "crypto";

import {
  forgotPasswordSchema,
  resendEmailSchema,
  signUpSchema,
  verifyAccountSchema,
} from "~/common/validation/auth";
import ConfirmAccount from "~/emails/confirm-account";
import ResetPassword from "~/emails/reset-password";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getBaseUrl } from "~/utils/get-base-url";

import type { User } from "@prisma/client";
import type { db as prismaDB } from "~/server/db";

const resend = new Resend(env.RESEND_API_KEY);

type SendEmailProps = {
  email: string;
  type: TokenType;
  verifyUrl: string;
};
const sendEmail = async ({ email, type, verifyUrl }: SendEmailProps) => {
  try {
    const subject =
      type === "EMAIL"
        ? "Confirm your gametrakr account"
        : "Reset your gametrakr password";
    const react = type === "EMAIL" ? ConfirmAccount : ResetPassword;
    const data = await resend.emails.send({
      from: `gametrakr <${env.RESEND_EMAIL}>`,
      to: [email],
      subject,
      react: react({ href: verifyUrl }),
      headers: { "X-Entity-Ref-ID": randomUUID() },
    });

    return data;
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to send the email",
    });
  }
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
    const verifyUrl = `${url}?token=${token.id}&email=${user.email}`;

    await sendEmail({ email: user.email, type, verifyUrl });
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
});
