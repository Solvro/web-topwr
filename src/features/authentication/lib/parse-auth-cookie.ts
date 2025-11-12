import { AuthStateSchema } from "../schemas/auth-state-schema";
import type { AuthState } from "../types";

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
  try {
    return AuthStateSchema.parse(JSON.parse(cookie));
  } catch {
    return null;
  }
}
