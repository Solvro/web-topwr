import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
    globals: true,
    exclude: [
      "**/node_modules/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
      "**/tests/e2e/**", // playwright tests
    ],
    coverage: {
      reportOnFailure: true,
      reporter: ["text", "json-summary", "json"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/components/ui", "src/tests"],
    },
  },
});
