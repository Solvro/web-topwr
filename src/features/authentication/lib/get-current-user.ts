import { fetchQuery } from "@/lib/fetch-utils";
import type { GetUserResponse } from "@/types/api";

import type { User } from "../types";

/** Fetches the details of the currently logged in user from the API. */
export async function getCurrentUser(
  accessTokenOverride?: string,
): Promise<User> {
  const user = await fetchQuery<GetUserResponse>("auth/me", {
    accessTokenOverride,
  });
  return user;
}
