import { join } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    include: ["src/tests/integration/**/*.test.ts"],
    setupFiles: ["src/tests/integration/setup.ts"],
    fileParallelism: false,
  },
  resolve: {
    alias: {
      "~/": join(import.meta.dirname, "./src/"),
    },
  },
});
