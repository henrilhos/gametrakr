-- Backfill profile_imagery from the legacy users.profile_image /
-- users.cover_image columns, and keep it synchronized with those columns
-- for as long as legacy upload code paths keep writing to them directly.
--
-- See docs/adr/0002-profile-imagery-persistence.md for the full rationale
-- and the rollback procedure (also mirrored in
-- src/server/db/drizzle/rollback/0009_backfill_profile_imagery.down.sql).

-- Classifies a legacy image location into a storage adapter identity and
-- storage key when it matches a recognized shape. Unrecognized locations
-- classify as (NULL, NULL): preserved as visible, unmanaged records with
-- no deletable storage key. Callers must not invoke this with a NULL or
-- empty-string location.
CREATE OR REPLACE FUNCTION classify_profile_imagery_location(location text)
RETURNS TABLE(adapter text, key text) AS $$
BEGIN
  -- UploadThing "ufsUrl" locations, e.g. https://<app-id>.ufs.sh/f/<key>.
  -- utfs.io is matched too for files uploaded before UploadThing's UFS
  -- rollout, whose URLs remain live on that legacy domain.
  IF location ~ '^https?://([a-zA-Z0-9-]+\.)?(ufs\.sh|utfs\.io)/f/[^/?#]+' THEN
    RETURN QUERY SELECT 'uploadthing'::text, substring(location FROM '/f/([^/?#]+)');
    RETURN;
  END IF;

  -- Local development uploads served from this app's own delivery route.
  IF location LIKE '/api/local-upload/%' THEN
    RETURN QUERY SELECT 'local'::text, substring(location FROM '^/api/local-upload/(.+)$');
    RETURN;
  END IF;

  RETURN QUERY SELECT NULL::text, NULL::text;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
--> statement-breakpoint

-- Backfill: one profile_imagery row per non-empty legacy location, keyed
-- by (user_id, kind). Users with a NULL or empty-string legacy column get
-- no row, matching "no current image" rather than an unmanaged one. Both
-- legacy columns are handled by one statement over a (kind, location)
-- pairing so the classification and insert shape isn't duplicated per
-- column.
INSERT INTO "profile_imagery" ("user_id", "kind", "public_location", "storage_adapter", "storage_key")
SELECT u."id", legacy."kind"::profile_imagery_kind, legacy."location", c."adapter", c."key"
FROM "users" u
CROSS JOIN LATERAL (
  VALUES ('profile', u."profile_image"), ('cover', u."cover_image")
) AS legacy("kind", "location")
CROSS JOIN LATERAL classify_profile_imagery_location(legacy."location") AS c
WHERE legacy."location" IS NOT NULL AND legacy."location" <> ''
ON CONFLICT ("user_id", "kind") DO NOTHING;
--> statement-breakpoint

-- Temporary transition trigger: legacy upload code (src/server/uploadthing.ts,
-- src/server/local-upload.ts) still writes profile/cover image URLs
-- directly to the users table until the deep Profile imagery module (and
-- its removal of these legacy paths) lands. Until then, this trigger
-- keeps profile_imagery current so it stays a reliable representation
-- without requiring those call sites to change. It is intentionally
-- dropped as part of that later removal -- see the rollback script.
-- Both legacy columns are handled by one loop over a (kind, new, old)
-- pairing rather than a duplicated per-column IF block.
CREATE OR REPLACE FUNCTION sync_profile_imagery_from_users() RETURNS trigger AS $$
DECLARE
  classified RECORD;
  changed RECORD;
BEGIN
  FOR changed IN
    SELECT * FROM (
      VALUES
        ('profile'::profile_imagery_kind, NEW."profile_image", CASE WHEN TG_OP = 'UPDATE' THEN OLD."profile_image" END),
        ('cover'::profile_imagery_kind, NEW."cover_image", CASE WHEN TG_OP = 'UPDATE' THEN OLD."cover_image" END)
    ) AS legacy("kind", "new_location", "old_location")
    WHERE legacy."new_location" IS NOT NULL AND legacy."new_location" <> ''
      AND (TG_OP = 'INSERT' OR legacy."new_location" IS DISTINCT FROM legacy."old_location")
  LOOP
    SELECT * INTO classified FROM classify_profile_imagery_location(changed."new_location");

    INSERT INTO "profile_imagery" ("user_id", "kind", "public_location", "storage_adapter", "storage_key", "current_revision", "revisioned_at", "updated_at")
    VALUES (NEW."id", changed."kind", changed."new_location", classified.adapter, classified.key, 1, now(), now())
    ON CONFLICT ("user_id", "kind") DO UPDATE SET
      "public_location" = EXCLUDED."public_location",
      "storage_adapter" = EXCLUDED."storage_adapter",
      "storage_key" = EXCLUDED."storage_key",
      "current_revision" = "profile_imagery"."current_revision" + 1,
      "revisioned_at" = now(),
      "updated_at" = now();
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

DROP TRIGGER IF EXISTS "users_sync_profile_imagery" ON "users";
--> statement-breakpoint

CREATE TRIGGER "users_sync_profile_imagery"
AFTER INSERT OR UPDATE OF "profile_image", "cover_image" ON "users"
FOR EACH ROW EXECUTE FUNCTION sync_profile_imagery_from_users();
--> statement-breakpoint

-- The only shape a Public profile projection may read Profile imagery
-- through. Deliberately excludes storage_adapter, storage_key, and
-- current_revision so that no reader can infer storage ownership from a
-- location, and no adapter/key/revision metadata leaks into Public
-- profile reads.
CREATE OR REPLACE VIEW "profile_imagery_public_locations" AS
SELECT "user_id", "kind", "public_location"
FROM "profile_imagery";
