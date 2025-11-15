import type { LogFn } from "pino";

import { typedFromEntries } from "@/utils";

import { LOG_LEVELS } from "../node";
import type { LogLevel } from "../types/internal";

const getLogger = async () =>
  typeof window === "undefined"
    ? await import("./logger.server").then((module_) => module_.serverLogger)
    : await import("./logger.client").then((module_) => module_.clientLogger);

type Logger = ReturnType<typeof getLogger>;

let loggerPromise: Logger | null = null;

const ensureLogger = async () => {
  loggerPromise ??= getLogger();
  return loggerPromise;
};

export const logger: Pick<Awaited<Logger>, LogLevel> = typedFromEntries(
  LOG_LEVELS.map((level) => [
    level,
    async (...arguments_: Parameters<LogFn>) => {
      const loggerInstance = await ensureLogger();
      loggerInstance[level](...arguments_);
    },
  ]),
);
