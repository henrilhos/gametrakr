import { join } from "path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "**/e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "**/server/api/trpc.ts",
        "**/server/auth.ts",
        "**/server/db/utils/**",
        "**/server/emails.ts",
        "**/server/igdb.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "~/": join(__dirname, "./src/"),
    },
  },
});
