import { TokenType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { add } from "date-fns";
import { Resend } from "resend";
import { randomUUID } from "crypto";

import { signUpSchema, verifyAccountSchema } from "~/common/validation/auth";
import ConfirmEmail from "~/emails/confirm-email";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import type { db as prismaDB } from "~/server/db";

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;

const resend = new Resend(env.RESEND_API_KEY);

const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const data = await resend.emails.send({
      from: `gametrakr <${env.RESEND_EMAIL}>`,
      to: [email],
      subject: "Confirm your gametrakr account",
      react: ConfirmEmail({ validationCode: token }),
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
  const validationToken = generateToken();
  const expirationDate = add(new Date(), {
    minutes: EMAIL_TOKEN_EXPIRATION_MINUTES,
  });

  try {
    await db.token.create({
      data: {
        expiration: expirationDate,
        token: validationToken,
        type: TokenType.EMAIL,
        userId: id,
      },
    });
    await sendVerificationEmail(email, validationToken);
  } catch (error) {
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
          OR: [{ email }, { username }],
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
        data: { username, email, password: hashedPassword },
      });

      await createEmailToken(result.id, result.email, ctx.db);

      return {
        status: 201,
        message: "User created successfully",
        result: result.id,
      };
    }),
  validateAccount: publicProcedure
    .meta({ description: "Validate user account" })
    .input(verifyAccountSchema)
    .mutation(async ({ ctx, input }) => {
      const { token, username } = input;

      const user = await ctx.db.user.findFirst({
        where: {
          OR: [{ email: username }, { username }],
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not exists",
        });
      }

      const emailToken = await ctx.db.token.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!emailToken?.valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Code does not exists",
        });
      }

      if (emailToken.expiration < new Date()) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Code expired",
        });
      }

      if (emailToken.user.email !== user.email) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Code invalid" });
      }

      await ctx.db.user.update({
        where: { id: user.id },
        data: { verified: true },
      });
      await ctx.db.token.update({
        where: { id: emailToken.id },
        data: { valid: false },
      });

      return {
        status: 200,
        message: "Account verified successfully",
        data: true,
      };
    }),
});

const generateToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
