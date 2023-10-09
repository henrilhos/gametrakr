import { TokenType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { Resend } from "resend";
import { randomUUID } from "crypto";

import {
  resendEmailSchema,
  signUpSchema,
  verifyAccountSchema,
} from "~/common/validation/auth";
import ConfirmEmail from "~/emails/confirm-email";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getBaseUrl } from "~/utils/api";

import type { db as prismaDB } from "~/server/db";

const resend = new Resend(env.RESEND_API_KEY);

const sendVerificationEmail = async (email: string, verifyUrl: string) => {
  try {
    const data = await resend.emails.send({
      from: `gametrakr <${env.RESEND_EMAIL}>`,
      to: [email],
      subject: "Confirm your gametrakr account",
      react: ConfirmEmail({ verifyUrl }),
      headers: {
        "X-Entity-Ref-ID": randomUUID(),
      },
    });

    console.log("data", data);

    return data;
  } catch (error) {
    console.log("error", error);

    return error;
  }
};

const createEmailToken = async (
  id: string,
  email: string,
  db: typeof prismaDB,
) => {
  try {
    await db.token.updateMany({
      where: {
        userId: id,
        type: TokenType.EMAIL,
      },
      data: {
        valid: false,
      },
    });

    const token = await db.token.create({
      data: {
        type: TokenType.EMAIL,
        userId: id,
      },
    });

    const verifyUrl = `${getBaseUrl()}/verify?token=${token.id}&type=${
      token.type
    }`;

    await sendVerificationEmail(email, verifyUrl);
  } catch (error) {
    console.log(error);
    return { status: "error", message: error };
  }
};

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

      const exists = await ctx.db.user.findFirst({
        where: {
          OR: [
            { email: { equals: email, mode: "insensitive" } },
            { username: { equals: username, mode: "insensitive" } },
          ],
        },
      });

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

      await createEmailToken(result.id, result.email, ctx.db);

      return {
        status: 201,
        message: "User created successfully",
        result: result.id,
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

      await createEmailToken(user.id, user.email, ctx.db);

      return { status: 200, message: "Email sent successfully" };
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
        status: 200,
        message: "Account verified successfully",
      };
    }),
});
