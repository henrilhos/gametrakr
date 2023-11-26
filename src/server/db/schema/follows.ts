import { relations } from "drizzle-orm";
import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const follows = pgTable(
  "follows",
  {
    followingUserId: uuid("following_user_id")
      .references(() => users.id)
      .notNull(),
    followedUserId: uuid("followed_user_id")
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
  },
  (follows) => ({
    uniqueFollow: primaryKey(follows.followingUserId, follows.followedUserId),
  }),
);

export const followsRelations = relations(follows, ({ one }) => ({
  followingUser: one(users, {
    relationName: "following",
    fields: [follows.followingUserId],
    references: [users.id],
  }),
  followedUser: one(users, {
    relationName: "followers",
    fields: [follows.followedUserId],
    references: [users.id],
  }),
}));
