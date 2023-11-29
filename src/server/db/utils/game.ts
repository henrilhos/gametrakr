import { eq } from "drizzle-orm";
import { db } from "~/server/db/db";
import { games } from "~/server/db/schema";

export const gameExists = (slug: string) =>
  db.query.games.findFirst({
    where: (game, { eq }) => eq(game.slug, slug),
  });

export const createGame = ({
  slug,
  name,
  cover,
  releaseDate,
}: {
  slug: string;
  name: string;
  cover: string;
  releaseDate: Date;
}) =>
  db
    .insert(games)
    .values({
      slug,
      name,
      cover,
      releaseDate,
    })
    .returning();

export const updateGame = ({
  id,
  cover,
  releaseDate,
}: {
  id: string;
  cover: string;
  releaseDate: Date;
}) =>
  db
    .update(games)
    .set({ releaseDate, cover })
    .where(eq(games.id, id))
    .returning();
