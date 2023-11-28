import { db } from "~/server/db/db";
import { games } from "~/server/db/schema";

export const gameExists = (slug: string) =>
  db.query.games.findFirst({
    where: (game, { eq }) => eq(game.slug, slug),
  });

export const createGame = (slug: string, name: string) =>
  db
    .insert(games)
    .values({
      slug,
      name,
    })
    .returning();
