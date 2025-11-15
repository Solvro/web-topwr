import type { LogLevel } from "../types/internal";

export const CONSOLE_METHODS = {
  trace: "debug",
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
  fatal: "error",
} satisfies Record<LogLevel, keyof Console>;
