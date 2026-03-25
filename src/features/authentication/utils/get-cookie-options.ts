import type { CookieOptions } from "@/types/cookies";

import type { AuthState, User } from "../types/internal";

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
      expires: new Date(authState.refreshTokenExpiresAt), // cookie will expire when refresh token expires
      sameSite: "lax",
    },
  ] as const;
}
