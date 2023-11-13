import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "../../env.mjs";

const main = async () => {
  console.log("Migrating database...");

  await migrate(drizzle(postgres(env.DATABASE_URL)), {
    migrationsFolder: "src/server/db/drizzle",
  });

  console.log("Database migrated");
  process.exit(0);
};

main().catch((err) => {
  console.log("Failed to migrate database");
  console.log(err);
  process.exit(1);
});
