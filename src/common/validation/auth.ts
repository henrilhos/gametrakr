import { TokenType } from "@prisma/client";
import { z } from "zod";

// Common fields

const username = z
  .string()
  .min(3, { message: "Nickname must be at least 3 characters" })
  .max(24, { message: "Nickname must be not exceed 15 characters" })
  .regex(
    new RegExp(/^[a-zA-Z0-9._]+$/),
    "Nickname can only have alphanumeric characters, underscores, and dots",
  )
  .describe("The user nickname");

const email = z
  .string()
  .email({ message: "Invalid email" })
  .describe("The user email");

const password = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(
    new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    ),
    "Password should include uppercase and lowercase letters, numbers, and special characters",
  )
  .describe("The user password");

const credential = z
  .union([email, username])
  .describe("User email or nickname");

// Schemas

export const signInSchema = z.object({
  credential: z.string(),
  passoword: z.string(),
});

export const signUpSchema = z
  .object({
    username,
    email,
    password,
    confirmPassword: password
      .min(8, "Passwords don't match")
      .describe("The user password (again 😁)"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const verifyAccountSchema = z.object({
  id: z.string().uuid().describe("Token id"),
  type: z.nativeEnum(TokenType).describe("Token type"),
});

export const resendEmailSchema = z.object({ email });

export const forgotPasswordSchema = z.object({ credential });

export const resetPasswordSchema = z.object({
  email,
  password,
  confirmPassword: password
    .min(8, "Passwords don't match")
    .describe("The user password (again 😁)"),
  token: z.string().uuid().describe("Token id"),
});

// Types

export type SignIn = z.infer<typeof signInSchema>;
export type SignUp = z.infer<typeof signUpSchema>;
export type VerifyAccount = z.infer<typeof verifyAccountSchema>;
export type ResendEmail = z.infer<typeof resendEmailSchema>;
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
