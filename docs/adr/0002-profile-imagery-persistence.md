# Profile imagery gets its own table, backfilled and temporarily dual-written, ahead of the deep module

Part of #284 ("Deepen the Profile imagery lifecycle"). This ADR covers only #285, the PostgreSQL persistence layer -- the module interface, storage adapters, browser processor, and edit-profile UI are separate, later child issues (#286-#290).

## Context

Profile and cover images are currently just `users.profile_image` / `users.cover_image` text columns holding whatever URL the last upload wrote (`src/server/uploadthing.ts`, `src/server/local-upload.ts`). There is no record of which storage adapter owns a location, no storage key to delete it by, and no revision to make replacement safe under concurrent uploads. The deep Profile imagery module (#287) needs all three before it can exist, and needs them to already be populated from existing data before it can switch reads and writes over.

## Decision

Add a `profile_imagery` table keyed by `(user_id, kind)` where `kind` is `'profile' | 'cover'`, storing `public_location`, `storage_adapter`, `storage_key`, `current_revision`, and lifecycle timestamps (`revisioned_at`, `created_at`, `updated_at`). A unique index on `(user_id, kind)` enforces one current record per Registered user and image kind, and doubles as the row a revision-checked finalize `UPDATE ... WHERE user_id = ? AND kind = ? AND current_revision = ?` compare-and-swaps against.

Two check constraints keep provenance explicit at the row level rather than left to application discipline:
- `storage_adapter IS NULL) = (storage_key IS NULL)`: a record is either fully managed (both set) or fully unmanaged (both null), never a mix that would let code guess at a deletable key it doesn't actually have.
- `storage_adapter IS NULL OR storage_adapter IN ('local', 'uploadthing')`: only the two adapters this app ships can claim ownership.

### Backfill

A data migration (`0009_backfill_profile_imagery.sql`) classifies every non-empty legacy `profile_image` / `cover_image` value through `classify_profile_imagery_location(text)`:
- UploadThing "ufsUrl" locations (`https://<app-id>.ufs.sh/f/<key>`, and the legacy `utfs.io` domain still live for files uploaded before UploadThing's UFS rollout) become `storage_adapter = 'uploadthing'`, `storage_key = <key>`.
- Local development uploads (`/api/local-upload/<filename>`) become `storage_adapter = 'local'`, `storage_key = <filename>`.
- Anything else becomes an unmanaged record: `public_location` is preserved as-is, `storage_adapter` and `storage_key` are both `NULL`. It stays visible; nothing deletes it, because nothing can prove it owns the byte behind it.
- `NULL` or empty-string legacy columns produce no row at all -- "no image" stays "no image" rather than becoming a phantom unmanaged record.

### Temporary sync with the legacy columns

Legacy upload code keeps writing directly to `users.profile_image` / `users.cover_image` until #287-#290 replace it. Until then, an `AFTER INSERT OR UPDATE OF profile_image, cover_image` trigger on `users` (`sync_profile_imagery_from_users`) re-runs the same classification and upserts `profile_imagery`, bumping `current_revision` on every write. This is a deliberate, temporary expand-and-dual-write step: `users` stays the source of truth for as long as the legacy code paths exist, and `profile_imagery` mirrors it, so the new table is never stale without requiring any change to the legacy call sites. Issue #290 removes this trigger along with the legacy columns and code it exists to bridge.

### Public projection

`profile_imagery_public_locations` is a plain SQL view (`SELECT user_id, kind, public_location FROM profile_imagery`) -- deliberately *not* bound as a typed Drizzle `pgView` in `src/server/db/schema/`. A typed binding was tried and reverted: re-exported through `~/server/db`'s schema barrel, it made `vi.mock("~/server/db")` automocking recurse into `RangeError: Maximum call stack size exceeded` across every unit test that mocks the db module. The view is exercised directly with a raw SQL query in `src/tests/integration/profile-imagery.test.ts`; a typed binding can be added once a reader (#289) actually needs it. Either way, the view's job is persistence-layer enforcement: a Public profile projection reading through it structurally cannot see `storage_adapter`, `storage_key`, or `current_revision`.

## Rollback

Because this migration only ever *reads* `users.profile_image` / `users.cover_image` (backfill) or mirrors them forward (the sync trigger), rolling it back cannot lose data -- the legacy columns are never written to or altered by it. Rollback is two manually-applied scripts in `src/server/db/drizzle/rollback/`, run in reverse order:

1. `0009_backfill_profile_imagery.down.sql` -- drops the view, the sync trigger, and both functions.
2. `0008_rapid_meggan.down.sql` -- drops `profile_imagery` and its enum type.

drizzle-kit does not generate down migrations, so these aren't run automatically; apply them with `psql "$DATABASE_URL" -f <path>`. Both are covered by an integration test (`src/tests/integration/profile-imagery-migration.test.ts`) that runs them against a real Postgres database and asserts the legacy columns and their data survive untouched, and that every table/type/view/trigger/function the feature added is gone afterward.

## Consequences

- The deep module (#287) has a real table with the constraints it needs (uniqueness, CAS-friendly revision) from day one, and doesn't have to design persistence itself.
- Storage provenance is explicit per row; no future code needs to infer ownership from a URL shape.
- Two write paths to `profile_imagery` exist for a while (the trigger, and eventually the module once #287 lands) -- this is intentional and time-boxed, closed out by #290.
- The public projection view has no typed Drizzle binding, which is a real cost (callers write raw SQL or `db.execute` until #289 needs it enough to justify solving the automock issue, e.g. via a `__mocks__/server/db.ts` factory instead of auto-mocking).
