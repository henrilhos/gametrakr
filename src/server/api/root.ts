import { authRouter } from "~/server/api/routers/auth";
import { carouselRouter } from "~/server/api/routers/carousel";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  carousel: carouselRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
