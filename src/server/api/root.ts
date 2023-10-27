import { authRouter } from "~/server/api/routers/auth";
import { searchRouter } from "~/server/api/routers/search";
import { createTRPCRouter } from "~/server/api/trpc";
import { gameRouter } from "./routers/game";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  game: gameRouter,
  search: searchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
