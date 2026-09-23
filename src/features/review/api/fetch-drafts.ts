import { compareDesc } from "date-fns";
import { cache } from "react";
import "server-only";

import {
  canManageAllDrafts,
  hasModelPermission,
} from "@/features/authentication";
import { getAuthStateServer } from "@/features/authentication/server";
import type { User } from "@/features/authentication/types";
import { fetchQuery } from "@/features/backend";
import { logger, parseError } from "@/features/logging";
import { getResourceMetadata } from "@/features/resources";
import { typedEntries } from "@/utils";

import { DRAFT_TYPE_RESOURCES } from "../data/draft-type-resources";
import type {
  DraftData,
  DraftType,
  DraftableResource,
  ResourceDraft,
} from "../types/internal";
import { getDraftResource } from "../utils/get-draft-resource";

/** Fetches all drafts (optionally of a single type) using the unified drafts endpoint. */
async function fetchDraftList(accessToken: string, resourceType?: DraftType) {
  try {
    const { data } = await fetchQuery<{ data: ResourceDraft[] }>(
      resourceType == null ? "drafts" : `drafts?resourceType=${resourceType}`,
      { accessTokenOverride: accessToken },
    );
    return data;
  } catch (error) {
    logger.warn(parseError(error), "Failed to fetch the list of drafts");
    return [];
  }
}

async function fetchSingleDraft(
  accessToken: string,
  resourceType: DraftType,
  resource: DraftableResource,
  id: number,
): Promise<ResourceDraft | null> {
  try {
    const { data } = await fetchQuery<{ data: DraftData }>(
      `${String(id)}?original=true`,
      { accessTokenOverride: accessToken, resource, draft: true },
    );
    return { resourceType, data } as ResourceDraft;
  } catch (error) {
    logger.warn(
      parseError(error),
      `Failed to fetch draft ${resource}/${String(id)}`,
    );
    return null;
  }
}

/** Fetches the drafts the user has access to, based on their read permissions. */
async function fetchPermittedDrafts(user: User, accessToken: string) {
  const requests = typedEntries(DRAFT_TYPE_RESOURCES).flatMap(
    ([resourceType, resource]) => {
      const { apiDraftPath } = getResourceMetadata(resource);
      if (apiDraftPath == null) {
        return [];
      }
      if (hasModelPermission(user, "read", apiDraftPath)) {
        return [fetchDraftList(accessToken, resourceType)];
      }
      const instanceIds = new Set(
        user.permissions
          .filter(
            (permission) =>
              permission.action === "read" &&
              permission.modelName === apiDraftPath &&
              permission.instanceId != null,
          )
          .map((permission) => Number(permission.instanceId)),
      );
      return [...instanceIds].map(async (id) => {
        const draft = await fetchSingleDraft(
          accessToken,
          resourceType,
          resource,
          id,
        );
        return draft == null ? [] : [draft];
      });
    },
  );
  const results = await Promise.all(requests);
  return results.flat();
}

/** Fetches all drafts visible to the currently logged in user, most recently updated first. */
export const fetchDrafts = cache(async (): Promise<ResourceDraft[]> => {
  const authState = await getAuthStateServer();
  if (authState == null) {
    return [];
  }
  const { user, accessToken } = authState;

  const drafts = canManageAllDrafts(user)
    ? await fetchDraftList(accessToken)
    : await fetchPermittedDrafts(user, accessToken);

  const unique = new Map(
    drafts.map((draft) => [
      `${getDraftResource(draft)}-${String(draft.data.id)}`,
      draft,
    ]),
  );
  return [...unique.values()].toSorted((a, b) =>
    compareDesc(a.data.updatedAt, b.data.updatedAt),
  );
});

/** Finds a draft of the given resource instance created by the currently logged in user, if one exists. */
export async function fetchOwnDraftOf(
  resource: DraftableResource,
  originalId: number | string,
): Promise<ResourceDraft | null> {
  const [drafts, authState] = await Promise.all([
    fetchDrafts(),
    getAuthStateServer(),
  ]);
  return (
    drafts.find(
      (draft) =>
        getDraftResource(draft) === resource &&
        String(draft.data.originalId) === String(originalId) &&
        draft.data.createdByUserId === authState?.user.id,
    ) ?? null
  );
}
