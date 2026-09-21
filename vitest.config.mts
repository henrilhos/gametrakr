import { join } from "path";
import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    exclude: [...configDefaults.exclude, "**/e2e/**", "**/integration/**"],
    coverage: {
      provider: "v8",
      reporter: ["html", "json-summary", "json", "text"],
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
      "~/": join(import.meta.dirname, "./src/"),
    },
  },
});
