import { authRouter } from "~/server/api/routers/auth";
import { gameRouter } from "~/server/api/routers/game";
import { searchRouter } from "~/server/api/routers/search";
import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  game: gameRouter,
  search: searchRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
