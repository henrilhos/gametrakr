import { z } from "zod";

export const signInSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Nickname must be at least 3 characters" })
      .max(50, { message: "Nickname must be not exceed 50 characters" }),
    email: z
      .string()
      .email({ message: "Invalid email" })
      .min(5, { message: "Email must be at least 5 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignIn = z.infer<typeof signInSchema>;
export type SignUp = z.infer<typeof signUpSchema>;
