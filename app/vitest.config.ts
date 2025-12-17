import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // Use React development build for act() support
    env: {
      NODE_ENV: "test",
    },
    // Exclude standalone integration tests (run via npx tsx)
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/__tests__/integration/**",
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
