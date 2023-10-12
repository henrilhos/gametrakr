import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import type { Carousel } from "@prisma/client";

const filterCarouselForClient = (carousel?: Carousel) => {
  if (!carousel) return {};

  return {
    name: carousel.name,
    publisher: carousel.publisher,
    releaseYear: new Date(carousel.releaseDate).getFullYear(),
    imageUrl: carousel.imageUrl,
  };
};

export const carouselRouter = createTRPCRouter({
  getRandomGame: publicProcedure
    .meta({ description: "Get a random game" })
    .query(async ({ ctx }) => {
      const [carousel] = await ctx.db.$queryRaw<
        Carousel[]
      >`SELECT * FROM "Carousel" WHERE active = true ORDER BY random() LIMIT 1`;

      console.log(carousel);

      return filterCarouselForClient(carousel);
    }),
});
