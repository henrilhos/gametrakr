import { TRPCError } from "@trpc/server";
import { hash } from "argon2";

import { signUpSchema } from "~/common/validation/auth";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, password, username } = input;

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

      return {
        status: 201,
        message: "User created successfully",
        result: result.id,
      };
    }),
});
