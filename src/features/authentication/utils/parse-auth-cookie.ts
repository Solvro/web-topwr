import { logger } from "@/features/logging";

import { AuthStateSchema } from "../schemas/auth-state-schema";
import type { AuthState } from "../types/internal";

/**
 * Attempts to read and parse the auth state from cookies.
 * Returns an `AuthState` object on success, and `null` on failure.
 */
export function parseAuthCookie(
  cookie: string | undefined | null,
): AuthState | null {
  if (cookie == null) {
    return null;
  }
  let parsedCookie: unknown;
  try {
    parsedCookie = JSON.parse(cookie);
  } catch (error) {
    logger.error(error, "Failed to parse auth cookie as JSON");
    return null;
  }
  const parseResult = AuthStateSchema.safeParse(parsedCookie);
  if (parseResult.success) {
    return parseResult.data;
  }
  logger.error(
    parseResult.error.format(),
    "Auth cookie does not match expected schema",
  );
  return null;
}
