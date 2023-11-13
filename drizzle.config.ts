import { type Config } from "drizzle-kit";
import { env } from "~/env.mjs";
import "dotenv/config";

export default {
  schema: "./src/server/db/schema/index.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: ["gametrakr-app_*"],
  out: "./src/server/db/drizzle",
  strict: true,
} satisfies Config;
