-- Rollback for 0008_rapid_meggan.sql (add_profile_imagery).
--
-- Not run automatically -- drizzle-kit does not generate down migrations.
-- Apply manually, and only after
-- 0009_backfill_profile_imagery.down.sql has already been applied (that
-- migration's view, trigger, and functions depend on this table).
--
-- Drops the profile_imagery table and its enum type. The legacy
-- users.profile_image / users.cover_image columns are untouched by this
-- migration and are unaffected by this rollback.
DROP TABLE IF EXISTS "profile_imagery";
--> statement-breakpoint

DROP TYPE IF EXISTS "public"."profile_imagery_kind";
