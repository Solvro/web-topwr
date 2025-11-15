import { DEFAULT_LOG_LEVEL } from "../constants";
import { LOG_LEVELS } from "../node";
import type { LogLevel } from "../types/internal";

/**
 * Extracts the log level and converts it from a number to a string name.
 * @example getLogLevel(20) // "debug"
 */
export const getLogLevel = (level: unknown): LogLevel => {
  if (level == null || typeof level !== "number") {
    return DEFAULT_LOG_LEVEL;
  }
  const levelIndex = Math.floor(level / 10) - 1;
  if (levelIndex < 0 || levelIndex >= LOG_LEVELS.length) {
    return DEFAULT_LOG_LEVEL;
  }
  return LOG_LEVELS[levelIndex];
};
