import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { games } from "~/server/db/schema/games";
import { users } from "~/server/db/schema/users";

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),

  rating: integer("rating"),
  content: text("content"),
  isSpoiler: boolean("is_spoiler").notNull().default(false),

  active: boolean("active").notNull().default(true),

  userId: uuid("user_id").notNull(),
  gameId: uuid("game_id").notNull(),

  createdAt: timestamp("created_at", { withTimezone: false })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: false })
    .notNull()
    .defaultNow(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  game: one(games, {
    fields: [reviews.userId],
    references: [games.id],
  }),
}));
