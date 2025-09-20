import type { GetUserResponse, User } from "@/types/api";

import { fetchQuery } from "../fetch-utils";

/** Prefers the user's full name, falling back to their email. */
export const getUserDisplayName = (user: User): string =>
  user.fullName ?? user.email;

/** Fetches the details of the currently logged in user from the API. */
export async function getCurrentUser(
  accessTokenOverride?: string,
): Promise<User> {
  const user = await fetchQuery<GetUserResponse>("auth/me", {
    accessTokenOverride,
  });
  return user;
}
