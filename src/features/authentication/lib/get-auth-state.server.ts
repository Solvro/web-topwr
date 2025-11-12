import { cookies } from "next/headers";
import { cache } from "react";
import "server-only";

import { AUTH_STATE_COOKIE_NAME } from "../data/auth-state-cookie-name";
import { verifyUserCookie } from "./verify-user-cookie";

/**
 * Obtains the auth state directly from the request cookies. Only works in React server components.
 * @see {@link useAuth} for the React client hook version.
 * @see {@link getAuthStateNode} for the non-component version.
 */
export const getAuthStateServer = cache(async () => {
  const allCookies = await cookies();
  const cookie = allCookies.get(AUTH_STATE_COOKIE_NAME);
  const authState = await verifyUserCookie(cookie);
  return authState;
});
