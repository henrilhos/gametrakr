import { and, eq, sql } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { profileImagery } from "~/server/db/schema";
import { getTestDatabase } from "./database";
import { createUserFixture } from "./fixtures";

describe("profile imagery persistence", () => {
  it("keeps a profile record and a cover record for the same registered user", async () => {
    const user = await createUserFixture();

    await getTestDatabase()
      .insert(profileImagery)
      .values([
        {
          userId: user.id,
          kind: "profile",
          publicLocation: "https://example.ufs.sh/f/profile-key",
          storageAdapter: "uploadthing",
          storageKey: "profile-key",
        },
        {
          userId: user.id,
          kind: "cover",
          publicLocation: "https://example.ufs.sh/f/cover-key",
          storageAdapter: "uploadthing",
          storageKey: "cover-key",
        },
      ]);

    const rows = await getTestDatabase()
      .select()
      .from(profileImagery)
      .where(eq(profileImagery.userId, user.id));

    expect(rows).toHaveLength(2);
    expect(rows.map((row) => row.kind).sort()).toEqual(["cover", "profile"]);
  });

  it("rejects a second current record for the same registered user and kind", async () => {
    const user = await createUserFixture();

    await getTestDatabase().insert(profileImagery).values({
      userId: user.id,
      kind: "profile",
      publicLocation: "https://example.ufs.sh/f/first-key",
      storageAdapter: "uploadthing",
      storageKey: "first-key",
    });

    const attempt = getTestDatabase()
      .insert(profileImagery)
      .values({
        userId: user.id,
        kind: "profile",
        publicLocation: "https://example.ufs.sh/f/second-key",
        storageAdapter: "uploadthing",
        storageKey: "second-key",
      });

    await expect(attempt).rejects.toMatchObject({
      cause: { constraint_name: "profile_imagery_user_id_kind_idx" },
    });
  });

  it("rejects a managed record missing its storage key, and an unmanaged record with one", async () => {
    const user = await createUserFixture();

    await expect(
      getTestDatabase().insert(profileImagery).values({
        userId: user.id,
        kind: "profile",
        publicLocation: "https://example.ufs.sh/f/orphan-key",
        storageAdapter: "uploadthing",
        storageKey: null,
      }),
    ).rejects.toMatchObject({
      cause: { constraint_name: "profile_imagery_adapter_key_pairing_check" },
    });

    await expect(
      getTestDatabase().insert(profileImagery).values({
        userId: user.id,
        kind: "cover",
        publicLocation: "https://cdn.example.com/legacy.png",
        storageAdapter: null,
        storageKey: "orphan-key",
      }),
    ).rejects.toMatchObject({
      cause: { constraint_name: "profile_imagery_adapter_key_pairing_check" },
    });
  });

  it("rejects a current_revision below 1", async () => {
    const user = await createUserFixture();

    await expect(
      getTestDatabase().insert(profileImagery).values({
        userId: user.id,
        kind: "profile",
        publicLocation: "https://example.ufs.sh/f/some-key",
        storageAdapter: "uploadthing",
        storageKey: "some-key",
        currentRevision: 0,
      }),
    ).rejects.toMatchObject({
      cause: { constraint_name: "profile_imagery_current_revision_check" },
    });
  });

  it("finalizes a replacement only when the intent's revision is still current", async () => {
    const user = await createUserFixture();
    const [created] = await getTestDatabase()
      .insert(profileImagery)
      .values({
        userId: user.id,
        kind: "profile",
        publicLocation: "https://example.ufs.sh/f/stale-key",
        storageAdapter: "uploadthing",
        storageKey: "stale-key",
        currentRevision: 1,
      })
      .returning();
    if (!created) throw new Error("Fixture row was not created");

    // A second replacement begins concurrently and bumps the revision.
    await getTestDatabase()
      .update(profileImagery)
      .set({ currentRevision: 2 })
      .where(eq(profileImagery.id, created.id));

    // The first (now stale) replacement tries to finalize against revision 1.
    const staleFinalize = await getTestDatabase()
      .update(profileImagery)
      .set({
        publicLocation: "https://example.ufs.sh/f/stale-finalized",
        storageKey: "stale-finalized",
      })
      .where(
        and(
          eq(profileImagery.userId, user.id),
          eq(profileImagery.kind, "profile"),
          eq(profileImagery.currentRevision, 1),
        ),
      )
      .returning();

    expect(staleFinalize).toHaveLength(0);

    // The second (current) replacement finalizes against revision 2.
    const currentFinalize = await getTestDatabase()
      .update(profileImagery)
      .set({
        publicLocation: "https://example.ufs.sh/f/current-finalized",
        storageKey: "current-finalized",
      })
      .where(
        and(
          eq(profileImagery.userId, user.id),
          eq(profileImagery.kind, "profile"),
          eq(profileImagery.currentRevision, 2),
        ),
      )
      .returning();

    expect(currentFinalize).toHaveLength(1);
    expect(currentFinalize[0]?.publicLocation).toBe(
      "https://example.ufs.sh/f/current-finalized",
    );
  });

  it("exposes only user, kind, and public location through the public read projection", async () => {
    const user = await createUserFixture();

    await getTestDatabase().insert(profileImagery).values({
      userId: user.id,
      kind: "profile",
      publicLocation: "https://example.ufs.sh/f/projected-key",
      storageAdapter: "uploadthing",
      storageKey: "projected-key",
      currentRevision: 3,
    });

    const rows = await getTestDatabase().execute<{
      user_id: string;
      kind: string;
      public_location: string;
    }>(
      sql`SELECT user_id, kind, public_location FROM profile_imagery_public_locations WHERE user_id = ${user.id}`,
    );

    expect([...rows]).toEqual([
      {
        user_id: user.id,
        kind: "profile",
        public_location: "https://example.ufs.sh/f/projected-key",
      },
    ]);

    const columnNames = await getTestDatabase().execute<{
      column_name: string;
    }>(
      sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'profile_imagery_public_locations'`,
    );

    expect([...columnNames].map((row) => row.column_name).sort()).toEqual([
      "kind",
      "public_location",
      "user_id",
    ]);
  });
});
