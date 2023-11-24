import { z } from "zod";

export const UserPersonalInfoSchema = z.object({
  location: z
    .string()
    .max(30, { message: "Location must not exceed 30 characters" })
    .optional(),
  bio: z
    .string()
    .max(160, { message: "Bio must not exceed 160 characters" })
    .optional(),
});
