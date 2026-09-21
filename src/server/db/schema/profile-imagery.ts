import { relations, sql } from "drizzle-orm";
import {
  check,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

/**
 * The two kinds of Profile imagery a Registered user controls on their
 * Public profile. See docs/adr/0002-profile-imagery-persistence.md.
 */
export const profileImageryKindEnum = pgEnum("profile_imagery_kind", [
  "profile",
  "cover",
]);

// Recognized storage adapters ('local', 'uploadthing') are enforced by
// adapterKnownCheck below, not mirrored as a TS constant here: `null`
// means the location is unmanaged (backfilled from an unrecognized legacy
// URL), visible but with no storage key to delete. See
// classify_profile_imagery_location() in the migration SQL for the other
// place this set is expressed.
export const profileImagery = pgTable(
  "profile_imagery",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    kind: profileImageryKindEnum("kind").notNull(),

    // The URL Public profile reads are allowed to see.
    publicLocation: text("public_location").notNull(),

    // Storage provenance. Both null (unmanaged/unknown legacy location) or
    // both set (managed by a known adapter) -- never mixed. Never exposed
    // through the Public profile projection
    // (see profile_imagery_public_locations in the migration SQL).
    storageAdapter: text("storage_adapter"),
    storageKey: text("storage_key"),

    // Bumped every time a replacement begins; finalize only applies when
    // the revision it started with is still current (optimistic
    // concurrency / "latest-started replacement wins").
    currentRevision: integer("current_revision").notNull().default(1),
    revisionedAt: timestamp("revisioned_at", { withTimezone: false })
      .notNull()
      .defaultNow(),

    createdAt: timestamp("created_at", { withTimezone: false })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: false })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    // Enforces one current record per Registered user and image kind, and
    // is the index that makes the revision-checked finalize UPDATE
    // ... WHERE user_id = ? AND kind = ? AND current_revision = ? an
    // atomic compare-and-swap over a single row.
    userKindIdx: uniqueIndex("profile_imagery_user_id_kind_idx").on(
      table.userId,
      table.kind,
    ),
    revisionCheck: check(
      "profile_imagery_current_revision_check",
      sql`${table.currentRevision} >= 1`,
    ),
    adapterKeyPairingCheck: check(
      "profile_imagery_adapter_key_pairing_check",
      sql`(${table.storageAdapter} IS NULL) = (${table.storageKey} IS NULL)`,
    ),
    adapterKnownCheck: check(
      "profile_imagery_adapter_known_check",
      sql`${table.storageAdapter} IS NULL OR ${table.storageAdapter} IN ('local', 'uploadthing')`,
    ),
  }),
);

export const profileImageryRelations = relations(profileImagery, ({ one }) => ({
  user: one(users, {
    fields: [profileImagery.userId],
    references: [users.id],
  }),
}));

// Note: the public read projection (profile_imagery_public_locations) is
// created as a plain SQL view in
// src/server/db/drizzle/0009_backfill_profile_imagery.sql rather than
// bound here as a typed Drizzle view. A `pgView(...).existing()` binding
// was tried and reverted: re-exported through ~/server/db's schema
// barrel, it made `vi.mock("~/server/db")` automocking recurse into a
// `RangeError: Maximum call stack size exceeded` across every unit test
// that mocks the db module (auth, game, public-profile, review, user
// routers). The view itself is exercised directly with a raw SQL query in
// src/tests/integration/profile-imagery.test.ts. A typed binding can be
// revisited once a reader actually needs it (see issue #289).
