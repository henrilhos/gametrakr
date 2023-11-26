import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { reviews } from "~/server/db/schema/reviews";

export const games = pgTable(
  "games",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").unique().notNull(),

    createdAt: timestamp("created_at", { withTimezone: false })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: false })
      .notNull()
      .defaultNow(),
  },
  (games) => ({
    slugIdx: uniqueIndex("slug_idx").on(games.slug),
  }),
);

export const gamesRelations = relations(games, ({ many }) => ({
  reviews: many(reviews),
}));
