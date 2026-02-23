import "server-only";

import { getAuthStateServer } from "@/features/authentication/server";
import { fetchQuery } from "@/features/backend";

import type { ResourceDraft } from "../types/internal";

export const fetchDrafts = async () => {
  const authState = await getAuthStateServer();

  if (authState == null) {
    return [];
  }

  const { data } = await fetchQuery<{ data: ResourceDraft[] }>("drafts", {
    accessTokenOverride: authState.accessToken,
  });
  return data;
};
