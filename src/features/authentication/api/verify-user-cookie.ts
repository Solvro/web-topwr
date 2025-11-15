import { logger, parseError } from "@/features/logging";

import type { AuthState, RequestCookie, User } from "../types/internal";
import { parseAuthCookie } from "../utils/parse-auth-cookie";
import { getCurrentUser } from "./get-current-user";

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
    logger.warn(parseError(error), "Invalid token in cookie");
    return null;
  }
  return { ...authState, user };
}
