import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

require("dotenv").config()

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: "./testing/setup.ts",
    exclude: ["node_modules", "e2e"],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
})
