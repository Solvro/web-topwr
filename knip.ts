import type { KnipConfig } from "knip";

const config: KnipConfig = {
  project: ["src/**"],
  entry: [
    "src/tests/e2e/*.setup.ts", // playwright test setup files
  ],
  ignore: [
    "src/components/ui/**", // not all shadcn components are used
  ],
  ignoreDependencies: [
    "@tailwindcss/typography", // used by tailwindcss in rich text editor
    "tailwindcss-animate", // added by Solvro/web-template, TODO?: possibly unnecessary
    "pino-pretty", // used indirectly in logging module during development
    "server-only", // react directive for server components
  ],
};

export default config;
