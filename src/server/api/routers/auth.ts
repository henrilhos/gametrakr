import ConfirmAccount from "~/components/emails/confirm-account";
import ResetPassword from "~/components/emails/reset-password";
import { getBaseUrl, passwordMatches } from "~/lib/utils";
import {
  ConfirmEmailSchema,
  ForgotPasswordSchema,
  ResendEmailSchema,
  ResetPasswordSchema,
  SignUpSchema,
} from "~/server/api/schemas/auth";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import * as dbUtils from "~/server/db/utils";
import { sendEmail } from "~/server/emails";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure.input(SignUpSchema).mutation(async ({ input }) => {
    const { confirmPassword, email, password, username } = input;

    if (!passwordMatches(password, confirmPassword)) {
      throw Error("Passwords don't match");
    }

    const canCreate = Boolean(
      await dbUtils.getUserIdByEmailOrUsername({
        email,
        username,
      }),
    );
    if (!canCreate) {
      throw Error("User already exists");
    }

    const [user] = await dbUtils.createUser({ email, password, username });
    if (!user?.id) {
      throw Error("User not created");
    }

    const [token] = await dbUtils.createAccountToken({ userId: user.id });
    if (!token) {
      throw Error("Token not created");
    }

    await sendEmail({
      subject: "Welcome to gametrakr 👋",
      to: [email],
      react: ConfirmAccount({
        href: `${getBaseUrl()}/confirm?token=${token.id}&email=${email}`,
      }),
    });

    return { ...user };
  }),

  resendAccountVerificationEmail: publicProcedure
    .input(ResendEmailSchema)
    .mutation(async ({ input }) => {
      const { email } = input;

      const userId = await dbUtils.getUserIdByEmail({ email });
      if (!userId) {
        throw Error("User not exists");
      }

      const [token] = await dbUtils.createAccountToken({ userId });
      if (!token) {
        throw Error("Token not created");
      }

      await sendEmail({
        subject: "Welcome to gametrakr 👋",
        to: [email],
        react: ConfirmAccount({
          href: `${getBaseUrl()}/confirm?token=${token.id}&email=${email}`,
        }),
      });

      return { message: "Email sent successfully" };
    }),

  confirmAccount: publicProcedure
    .input(ConfirmEmailSchema)
    .mutation(async ({ input }) => {
      const { email, tokenId } = input;

      const user = await dbUtils.getUserByEmail({ email });
      if (!user) {
        throw Error("User not found");
      }

      if (user.verified) {
        throw Error("User already verified");
      }

      const token = await dbUtils.getAccountTokenByIdAndUserId({
        id: tokenId,
        userId: user.id,
      });
      if (!token) {
        throw new Error("Token not found");
      }

      await dbUtils.setTokensAsInvalid({
        userId: user.id,
        tokenType: "account",
      });
      await dbUtils.verifyUser({ id: user.id });

      return { message: "Account verified successfully" };
    }),

  sendResetPasswordEmail: publicProcedure
    .input(ForgotPasswordSchema)
    .mutation(async ({ input }) => {
      const { credential } = input;

      const user = await dbUtils.getUserByCredential({ credential });
      if (!user) {
        throw Error("User not exists");
      }

      const [token] = await dbUtils.createPasswordToken({ userId: user.id });
      if (!token) {
        throw Error("Token not created");
      }

      await sendEmail({
        subject: "Reset your gametrakr password",
        to: [user.email],
        react: ResetPassword({
          href: `${getBaseUrl()}/password/reset?token=${token.id}&email=${
            user.email
          }`,
        }),
      });

      return { email: user.email };
    }),

  resetPassword: publicProcedure
    .input(ResetPasswordSchema)
    .mutation(async ({ input }) => {
      const { confirmPassword, email, password, token: tokenId } = input;

      if (!passwordMatches(password, confirmPassword)) {
        throw Error("Passwords don't match");
      }

      const user = await dbUtils.getUserByEmail({ email });
      if (!user) {
        throw new Error("User not found");
      }

      const token = await dbUtils.getPasswordTokenByIdAndUserId({
        id: tokenId,
        userId: user.id,
      });
      if (!token) {
        throw Error("Token not found");
      }

      await dbUtils.setTokensAsInvalid({
        userId: user.id,
        tokenType: "password",
      });
      await dbUtils.updateUserPassword({ userId: user.id, password });

      return { message: "Email sent successfully" };
    }),
});
