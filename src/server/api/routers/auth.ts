import ConfirmAccount from "~/components/emails/confirm-account";
import ResetPassword from "~/components/emails/reset-password";
import { getBaseUrl } from "~/lib/utils";
import {
  ConfirmEmailSchema,
  ForgotPasswordSchema,
  ResendEmailSchema,
  ResetPasswordSchema,
  SignUpSchema,
} from "~/server/api/schemas/auth";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  canCreateUser,
  createAccountToken,
  createPasswordToken,
  createUser,
  getAccountTokenByIdAndUserId,
  getPasswordTokenByIdAndUserId,
  getUserByCredential,
  getUserByEmail,
  getUserIdByEmail,
  invalidateTokens,
  updateUserPassword,
  verifyUser,
} from "~/server/db";
import { sendEmail } from "~/server/emails";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure.input(SignUpSchema).mutation(async ({ input }) => {
    const { confirmPassword, email, password, username } = input;

    const isPasswordValid = password === confirmPassword;
    if (!isPasswordValid) {
      throw Error("Passwords don't match");
    }

    const canCreate = await canCreateUser({ email, username });
    if (!canCreate) {
      throw Error("User already exists");
    }

    const [user] = await createUser({ email, password, username });
    if (!user?.id) {
      throw Error("User not created");
    }

    const [token] = await createAccountToken({ userId: user.id });
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

      const userId = await getUserIdByEmail({ email });
      if (!userId) {
        throw Error("User not exists");
      }

      const [token] = await createAccountToken({ userId });
      if (!token) {
        throw Error("Token not created");
      }

      return await sendEmail({
        subject: "Welcome to gametrakr 👋",
        to: [email],
        react: ConfirmAccount({
          href: `${getBaseUrl()}/confirm?token=${token.id}&email=${email}`,
        }),
      });
    }),

  confirmAccount: publicProcedure
    .input(ConfirmEmailSchema)
    .mutation(async ({ input }) => {
      const { email, tokenId } = input;

      const user = await getUserByEmail({ email });
      if (!user) {
        throw Error("User not found");
      }

      if (user.verified) {
        throw Error("User already verified");
      }

      const token = await getAccountTokenByIdAndUserId({
        tokenId,
        userId: user.id,
      });
      if (!token) {
        throw new Error("Token not found");
      }

      await invalidateTokens({ userId: user.id, tokenType: "account" });
      await verifyUser({ id: user.id });
    }),

  sendResetPasswordEmail: publicProcedure
    .input(ForgotPasswordSchema)
    .mutation(async ({ input }) => {
      const { credential } = input;

      const user = await getUserByCredential({ credential });
      if (!user) {
        throw Error("User not exists");
      }

      const [token] = await createPasswordToken({ userId: user.id });
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

      const isPasswordValid = password === confirmPassword;
      if (!isPasswordValid) {
        throw Error("Password don't match");
      }

      const user = await getUserByEmail({ email });
      if (!user) {
        throw new Error("User not found");
      }

      const token = await getPasswordTokenByIdAndUserId({
        tokenId,
        userId: user.id,
      });
      if (!token) {
        throw Error("Token not found");
      }

      await invalidateTokens({ userId: user.id, tokenType: "account" });
      await updateUserPassword({ userId: user.id, password });
    }),
});
