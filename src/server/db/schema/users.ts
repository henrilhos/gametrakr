import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { follows } from "./follows";
import { tokens } from "./tokens";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    email: text("email").unique().notNull(),
    username: text("username").unique().notNull(),
    password: text("password").notNull(),

    location: text("location"),
    bio: text("bio"),

    profileImage: text("profile_image"),
    coverImage: text("cover_image"),

    verified: boolean("verified").notNull().default(false),
    active: boolean("active").notNull().default(true),

    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow(),
  },
  (users) => ({
    emailIdx: uniqueIndex("email_idx").on(users.email),
    usernameIdx: uniqueIndex("username_idx").on(users.username),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  followers: many(follows, {
    relationName: "followers",
  }),
  following: many(follows, {
    relationName: "following",
  }),
  tokens: many(tokens),
}));
