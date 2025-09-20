import type { User } from "@/types/api";

import { fetchQuery } from "../fetch-utils";

/** Prefers the user's full name, falling back to their email. */
export const getUserDisplayName = (user: User): string =>
  user.fullName ?? user.email;

/** Fetches the details of the currently logged in user from the API. */
export async function getCurrentUser(accessTokenOverride?: string) {
  const { user } = await fetchQuery<{ user: User }>("auth/me", {
    accessTokenOverride,
  });
  return user;
}
