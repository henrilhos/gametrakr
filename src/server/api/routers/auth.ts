import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { Resend } from "resend";

import { signUpSchema } from "~/common/validation/auth";
import ConfirmEmail from "~/emails/confirm-email";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const resend = new Resend(env.RESEND_API_KEY);

const sendVerificationEmail = async () => {
  try {
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["resend.development@henrique.zip"],
      subject: "Confirm your gametrakr account",
      react: ConfirmEmail({ validationCode: "654321" }),
    });

    console.log("data", data);

    return data;
  } catch (error) {
    console.log("error", error);

    return error;
  }
};

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
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

      await sendVerificationEmail();

      return {
        status: 201,
        message: "User created successfully",
        result: result.id,
      };
    }),
});
