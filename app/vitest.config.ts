import type { UserConfig } from "vitest/config";
import path from "node:path";

const config: UserConfig = {
  test: {
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};

export default config;
