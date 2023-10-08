import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().describe("User email or nickname"),
  password: z.string().describe("User password"),
});

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Nickname must be at least 3 characters" })
      .max(24, { message: "Nickname must be not exceed 15 characters" })
      .regex(
        new RegExp(/^[a-zA-Z0-9._]+$/),
        "Nickname can only have alphanumeric characters, underscores, and dots",
      )
      .describe("The user nickname"),
    email: z
      .string()
      .email({ message: "Invalid email" })
      .describe("The user email"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(
        new RegExp(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        ),
        "Password should include uppercase and lowercase letters, numbers, and special characters",
      )
      .describe("The user password"),
    confirmPassword: z
      .string()
      .min(8, "Passwords don't match")
      .describe("The user password (again 😁)"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const verifyAccountSchema = z.object({
  email: z.string().min(1).describe("User email for validation"),
  token: z.string().min(6).max(6).describe("Token sent for user email"),
});

export type SignIn = z.infer<typeof signInSchema>;
export type SignUp = z.infer<typeof signUpSchema>;
export type VerifyAccount = z.infer<typeof verifyAccountSchema>;
