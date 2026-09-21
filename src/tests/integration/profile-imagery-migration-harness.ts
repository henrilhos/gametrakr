import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const MIGRATIONS_DIR = join(process.cwd(), "src/server/db/drizzle");

type Journal = {
  version: string;
  dialect: string;
  entries: Array<{
    idx: number;
    version: string;
    when: number;
    tag: string;
    breakpoints: boolean;
  }>;
};

/**
 * Builds a throwaway migrations folder containing only the entries that
 * come *before* `beforeTag` in the real journal, so a test can start a
 * database at that point in schema history, seed representative
 * pre-migration data, and then finish applying the rest of the real
 * migrations to exercise a data backfill against it.
 */
const buildCutoffMigrationsFolder = async (beforeTag: string) => {
  const journalPath = join(MIGRATIONS_DIR, "meta", "_journal.json");
  const journal = JSON.parse(
    await readFile(journalPath, "utf8"),
  ) as Journal;

  const cutoffEntry = journal.entries.find((entry) => entry.tag === beforeTag);
  if (!cutoffEntry) {
    throw new Error(`No migration journal entry tagged "${beforeTag}"`);
  }

  const priorEntries = journal.entries.filter(
    (entry) => entry.idx < cutoffEntry.idx,
  );

  const dir = await mkdtemp(join(tmpdir(), "profile-imagery-migrations-"));
  await mkdir(join(dir, "meta"), { recursive: true });
  await writeFile(
    join(dir, "meta", "_journal.json"),
    JSON.stringify({ ...journal, entries: priorEntries }, null, 2),
  );

  await Promise.all(
    priorEntries.map(async (entry) => {
      const sql = await readFile(join(MIGRATIONS_DIR, `${entry.tag}.sql`), "utf8");
      await writeFile(join(dir, `${entry.tag}.sql`), sql);
    }),
  );

  return dir;
};

export type PreMigrationDatabase = {
  /** Runs raw SQL against the schema as it existed before `beforeTag`. */
  seed: (sql: string) => Promise<void>;
  /** Applies the remaining real migrations, including `beforeTag` onward. */
  finishMigrating: () => Promise<void>;
  /** The raw postgres-js client, usable once `finishMigrating` has completed. */
  client: ReturnType<typeof postgres>;
  stop: () => Promise<void>;
};

export const startPreMigrationDatabase = async (
  beforeTag: string,
): Promise<PreMigrationDatabase> => {
  const container = await new PostgreSqlContainer("postgres:15-alpine")
    .withDatabase("gametrakr_migration_test")
    .withUsername("gametrakr")
    .withPassword("gametrakr")
    .start();

  const client = postgres(container.getConnectionUri());
  const db = drizzle(client);

  const cutoffDir = await buildCutoffMigrationsFolder(beforeTag);
  await migrate(db, { migrationsFolder: cutoffDir });
  await rm(cutoffDir, { recursive: true, force: true });

  return {
    seed: async (sql: string) => {
      await client.unsafe(sql);
    },
    finishMigrating: async () => {
      await migrate(db, { migrationsFolder: MIGRATIONS_DIR });
    },
    client,
    stop: async () => {
      await client.end({ timeout: 5 });
      await container.stop();
    },
  };
};
