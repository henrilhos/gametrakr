import { join } from "node:path";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "~/server/db/schema";

type TestDatabase = ReturnType<typeof drizzle<typeof schema>>;

let container: Awaited<ReturnType<PostgreSqlContainer["start"]>> | undefined;
let client: ReturnType<typeof postgres> | undefined;
let database: TestDatabase | undefined;

export async function startTestDatabase() {
  container = await new PostgreSqlContainer("postgres:15-alpine")
    .withDatabase("gametrakr_test")
    .withUsername("gametrakr")
    .withPassword("gametrakr")
    .start();

  client = postgres(container.getConnectionUri());
  database = drizzle(client, { schema });
  await migrate(database, {
    migrationsFolder: join(process.cwd(), "src/server/db/drizzle"),
  });
}

export function getTestDatabase() {
  if (!database) {
    throw new Error("The integration test database has not been started");
  }
  return database;
}

export async function resetTestDatabase() {
  if (!client) {
    throw new Error("The integration test database has not been started");
  }

  await client.unsafe(
    `TRUNCATE TABLE "follows", "reviews", "tokens", "profile_imagery", "games", "users" CASCADE`,
  );
}

export async function stopTestDatabase() {
  await client?.end({ timeout: 5 });
  await container?.stop();
  client = undefined;
  database = undefined;
  container = undefined;
}
