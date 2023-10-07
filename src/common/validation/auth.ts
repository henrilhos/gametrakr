import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

export const signUpSchema = signInSchema.extend({
  email: z.string().email(),
});

export type SignIn = z.infer<typeof signInSchema>;
export type SignUp = z.infer<typeof signUpSchema>;
