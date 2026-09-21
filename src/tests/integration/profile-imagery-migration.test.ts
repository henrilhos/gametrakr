import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { afterEach, describe, expect, it } from "vitest";
import * as schema from "~/server/db/schema";
import {
  startPreMigrationDatabase,
  type PreMigrationDatabase,
} from "./profile-imagery-migration-harness";

let harness: PreMigrationDatabase | undefined;

afterEach(async () => {
  await harness?.stop();
  harness = undefined;
});

describe("profile imagery backfill migration", () => {
  it("backfills recognized UploadThing and local-upload locations, preserves unknown ones, and skips empty/null legacy locations", async () => {
    harness = await startPreMigrationDatabase("0008_rapid_meggan");

    const uploadthingUser = randomUUID();
    const localUser = randomUUID();
    const unknownUser = randomUUID();
    const emptyUser = randomUUID();
    const nullUser = randomUUID();

    await harness.seed(`
      INSERT INTO users (id, email, username, password, profile_image, cover_image)
      VALUES
        ('${uploadthingUser}', 'ut@example.com', 'ut-user', 'x',
          'https://myapp.ufs.sh/f/abc123profileKey',
          'https://myapp.ufs.sh/f/abc123coverKey'),
        ('${localUser}', 'local@example.com', 'local-user', 'x',
          '/api/local-upload/11111111-1111-1111-1111-111111111111.png',
          '/api/local-upload/22222222-2222-2222-2222-222222222222.jpg'),
        ('${unknownUser}', 'unknown@example.com', 'unknown-user', 'x',
          'https://cdn.example.com/legacy/profile.png',
          NULL),
        ('${emptyUser}', 'empty@example.com', 'empty-user', 'x', '', ''),
        ('${nullUser}', 'null@example.com', 'null-user', 'x', NULL, NULL);
    `);

    await harness.finishMigrating();

    const database = drizzle(harness.client, { schema });
    const rows = await database
      .select()
      .from(schema.profileImagery)
      .orderBy(schema.profileImagery.publicLocation);

    const byUserAndKind = (userId: string, kind: "profile" | "cover") =>
      rows.find((row) => row.userId === userId && row.kind === kind);

    // Recognized UploadThing locations are backfilled as managed records.
    expect(byUserAndKind(uploadthingUser, "profile")).toMatchObject({
      publicLocation: "https://myapp.ufs.sh/f/abc123profileKey",
      storageAdapter: "uploadthing",
      storageKey: "abc123profileKey",
    });
    expect(byUserAndKind(uploadthingUser, "cover")).toMatchObject({
      publicLocation: "https://myapp.ufs.sh/f/abc123coverKey",
      storageAdapter: "uploadthing",
      storageKey: "abc123coverKey",
    });

    // Recognized local-upload locations are backfilled as managed records.
    expect(byUserAndKind(localUser, "profile")).toMatchObject({
      publicLocation:
        "/api/local-upload/11111111-1111-1111-1111-111111111111.png",
      storageAdapter: "local",
      storageKey: "11111111-1111-1111-1111-111111111111.png",
    });
    expect(byUserAndKind(localUser, "cover")).toMatchObject({
      publicLocation:
        "/api/local-upload/22222222-2222-2222-2222-222222222222.jpg",
      storageAdapter: "local",
      storageKey: "22222222-2222-2222-2222-222222222222.jpg",
    });

    // Unknown locations are preserved, visible, but unmanaged.
    expect(byUserAndKind(unknownUser, "profile")).toMatchObject({
      publicLocation: "https://cdn.example.com/legacy/profile.png",
      storageAdapter: null,
      storageKey: null,
    });
    expect(byUserAndKind(unknownUser, "cover")).toBeUndefined();

    // Empty-string and null legacy locations produce no record at all.
    expect(byUserAndKind(emptyUser, "profile")).toBeUndefined();
    expect(byUserAndKind(emptyUser, "cover")).toBeUndefined();
    expect(byUserAndKind(nullUser, "profile")).toBeUndefined();
    expect(byUserAndKind(nullUser, "cover")).toBeUndefined();
  });

  it("keeps profile_imagery synchronized when legacy upload code writes to users after migration", async () => {
    harness = await startPreMigrationDatabase("0008_rapid_meggan");
    const userId = randomUUID();

    await harness.seed(`
      INSERT INTO users (id, email, username, password)
      VALUES ('${userId}', 'sync@example.com', 'sync-user', 'x');
    `);

    await harness.finishMigrating();

    const database = drizzle(harness.client, { schema });

    // Legacy upload code (src/server/uploadthing.ts) still writes directly
    // to users.profile_image today; the transition trigger must mirror
    // that write into profile_imagery without any application change.
    await harness.seed(`
      UPDATE users
      SET profile_image = 'https://myapp.ufs.sh/f/firstProfileKey'
      WHERE id = '${userId}';
    `);

    const [firstSync] = await database
      .select()
      .from(schema.profileImagery)
      .where(eq(schema.profileImagery.userId, userId));

    expect(firstSync).toMatchObject({
      kind: "profile",
      publicLocation: "https://myapp.ufs.sh/f/firstProfileKey",
      storageAdapter: "uploadthing",
      storageKey: "firstProfileKey",
      currentRevision: 1,
    });

    // A later legacy replacement advances the revision and location.
    await harness.seed(`
      UPDATE users
      SET profile_image = 'https://myapp.ufs.sh/f/secondProfileKey'
      WHERE id = '${userId}';
    `);

    const [secondSync] = await database
      .select()
      .from(schema.profileImagery)
      .where(eq(schema.profileImagery.userId, userId));

    expect(secondSync).toMatchObject({
      publicLocation: "https://myapp.ufs.sh/f/secondProfileKey",
      storageAdapter: "uploadthing",
      storageKey: "secondProfileKey",
      currentRevision: 2,
    });
  });

  it("rolls back without touching legacy columns or other tables", async () => {
    harness = await startPreMigrationDatabase("0008_rapid_meggan");
    const userId = randomUUID();

    await harness.seed(`
      INSERT INTO users (id, email, username, password, profile_image, cover_image)
      VALUES ('${userId}', 'rollback@example.com', 'rollback-user', 'x',
        'https://myapp.ufs.sh/f/rollbackProfileKey', NULL);
    `);

    await harness.finishMigrating();

    const rollbackDir = join(process.cwd(), "src/server/db/drizzle/rollback");
    const backfillDown = await readFile(
      join(rollbackDir, "0009_backfill_profile_imagery.down.sql"),
      "utf8",
    );
    const tableDown = await readFile(
      join(rollbackDir, "0008_rapid_meggan.down.sql"),
      "utf8",
    );

    await harness.seed(backfillDown);
    await harness.seed(tableDown);

    const database = drizzle(harness.client);

    // The legacy columns and their data survive the rollback untouched.
    const legacyRows = await database.execute<{
      profile_image: string | null;
      cover_image: string | null;
    }>(
      sql`SELECT profile_image, cover_image FROM users WHERE id = ${userId}`,
    );
    expect([...legacyRows]).toEqual([
      {
        profile_image: "https://myapp.ufs.sh/f/rollbackProfileKey",
        cover_image: null,
      },
    ]);

    // Every trace of the feature is gone: table, enum type, view, trigger,
    // and both functions.
    const remainingObjects = await database.execute<{ name: string }>(sql`
      SELECT 'table' AS kind, table_name AS name FROM information_schema.tables WHERE table_name IN ('profile_imagery', 'profile_imagery_public_locations')
      UNION ALL
      SELECT 'type', typname FROM pg_type WHERE typname = 'profile_imagery_kind'
      UNION ALL
      SELECT 'trigger', tgname FROM pg_trigger WHERE tgname = 'users_sync_profile_imagery'
      UNION ALL
      SELECT 'function', proname FROM pg_proc WHERE proname IN ('sync_profile_imagery_from_users', 'classify_profile_imagery_location')
    `);
    expect([...remainingObjects]).toHaveLength(0);
  });
});
