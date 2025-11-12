import type { AuthState, CookieOptions, User } from "../types/internal";

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
