import type { AuthState, RequestCookie, User } from "../types/internal";
import { getCurrentUser } from "./get-current-user";
import { parseAuthCookie } from "./parse-auth-cookie";

export async function verifyUserCookie(
  cookie: RequestCookie | undefined,
): Promise<AuthState | null> {
  if (cookie == null) {
    return null;
  }
  const authState = parseAuthCookie(cookie.value);
  if (authState == null) {
    return null;
  }
  let user: User;
  try {
    user = await getCurrentUser(authState.accessToken);
  } catch (error) {
    console.warn("Invalid token in cookie:", error);
    return null;
  }
  return { ...authState, user };
}
