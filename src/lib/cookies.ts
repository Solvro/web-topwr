import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

import { AuthStateSchema } from "@/schemas";
import type { AuthState, User } from "@/types/api";

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

type CookieOptions = Partial<ResponseCookie> & Cookies.CookieAttributes;

/** Prepares the user state to be saved to cookies. */
export function getCookieOptions(
  authState: AuthState,
  user?: User,
): [string, CookieOptions] {
  const cookie = JSON.stringify({ ...authState, user: user ?? authState.user });
  return [
    cookie,
    {
      // TODO: add more secure cookie flag options
      expires: Date.now() + 60 * 60 * 24 * 30 * 1000, // 30 days, will be removed if it expires early
      sameSite: "lax",
    },
  ] as const;
}
