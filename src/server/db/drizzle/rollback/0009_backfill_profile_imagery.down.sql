-- Rollback for 0009_backfill_profile_imagery.sql.
--
-- Not run automatically -- drizzle-kit does not generate down migrations.
-- Apply manually (e.g. via `psql "$DATABASE_URL" -f ...`) if this
-- migration needs to be reverted, in this order:
--   1. 0009_backfill_profile_imagery.down.sql (this file)
--   2. 0008_rapid_meggan.down.sql
--
-- Safe by construction: this migration never wrote to users.profile_image
-- or users.cover_image, only read from them, so rolling it back cannot
-- lose data. Reverting drops profile_imagery and everything backfilled
-- into it; the legacy columns remain the intact source of truth.
DROP VIEW IF EXISTS "profile_imagery_public_locations";
--> statement-breakpoint

DROP TRIGGER IF EXISTS "users_sync_profile_imagery" ON "users";
--> statement-breakpoint

DROP FUNCTION IF EXISTS sync_profile_imagery_from_users();
--> statement-breakpoint

DROP FUNCTION IF EXISTS classify_profile_imagery_location(text);
