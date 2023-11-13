import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const tokenTypeEnum = pgEnum("type", ["account", "password"]);

export const tokens = pgTable("tokens", {
  id: uuid("id").primaryKey().defaultRandom(),

  type: tokenTypeEnum("type").notNull(),
  valid: boolean("valid").notNull().default(true),
  userId: uuid("user_id").notNull(),

  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow(),
});

export const tokensRelations = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.userId],
    references: [users.id],
  }),
}));
