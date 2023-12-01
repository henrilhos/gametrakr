import { z } from "zod";

export const ReviewSchema = z.object({
  rating: z
    .number()
    .int()
    .gte(0, { message: "Rating is too low" })
    .lte(10, { message: "Rating is too high" })
    .optional(),
  isSpoiler: z.boolean().default(false),
  content: z.string().optional(),
});

export type Review = z.infer<typeof ReviewSchema>;
