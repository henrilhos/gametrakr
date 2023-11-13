import { z } from "zod";

const AuthSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Nickname must be at least 3 characters" })
    .max(24, { message: "Nickname must be not exceed 24 characters" })
    .regex(
      new RegExp(/^[a-zA-Z0-9._]+$/),
      "Nickname can only have alphanumeric characters, underscores, and dots",
    )
    .describe("Username"),
  email: z.string().email({ message: "Invalid email" }).describe("Email"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .describe("Password"),
  confirmPassword: z
    .string()
    .min(8, "Passwords don't match")
    .describe("Confirm password"),
});

export const SignInSchema = z.object({
  credential: z.string(),
  password: z.string(),
});

export const SignUpSchema = AuthSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  },
);

export const ResendEmailSchema = AuthSchema.pick({ email: true });

export const ConfirmEmailSchema = z.object({
  email: z.string(),
  tokenId: z.string(),
});

export const ForgotPasswordSchema = z.object({
  credential: z.string(),
});

export const ResetPasswordSchema = AuthSchema.pick({
  email: true,
  password: true,
  confirmPassword: true,
})
  .extend({
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
