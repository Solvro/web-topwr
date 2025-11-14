import { fetchQuery } from "@/features/backend";
import type { GetUserResponse } from "@/features/backend/types";

import type { User } from "../types/internal";

/** Fetches the details of the currently logged in user from the API. */
export async function getCurrentUser(
  accessTokenOverride?: string,
): Promise<User> {
  const user = await fetchQuery<GetUserResponse>("auth/me", {
    accessTokenOverride,
  });
  return user;
}
