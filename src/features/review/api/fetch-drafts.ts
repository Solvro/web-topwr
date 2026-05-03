import "server-only";

import { isAdmin, isSolvroAdmin } from "@/features/authentication";
import { getAuthStateServer } from "@/features/authentication/server";
import type { User } from "@/features/authentication/types";
import { fetchQuery } from "@/features/backend";
import { getResourceMetadata } from "@/features/resources";
import type { ResourceDataType } from "@/features/resources/types";
import { typedEntries } from "@/utils";

import { DRAFT_TYPE_RESOURCES } from "../data/draft-type-resources";
import type { DraftableResource, ResourceDraft } from "../types/internal";

async function fetchDraftsForAdmins(accessToken: string) {
  try {
    const { data } = await fetchQuery<{ data: ResourceDraft[] }>("drafts", {
      accessTokenOverride: accessToken,
    });
    return data;
  } catch {
    return [];
  }
}

/** Fetches drafts of the given user based on instance-level read permissions. */
async function fetchUserOwnedDrafts(user: User, accessToken: string) {
  const draftResourceEntries = typedEntries(DRAFT_TYPE_RESOURCES);

  const draftPathToInfo = draftResourceEntries
    .map(([draftType, resource]) => ({
      draftType,
      resource,
      path: getResourceMetadata(resource).apiDraftPath,
    }))
    .filter((info) => info.path != null);

  const relevantPermissions = user.permissions.filter(
    (permission) =>
      permission.action === "read" &&
      permission.instanceId != null &&
      draftPathToInfo.some((info) => info.path === permission.modelName),
  );
  if (relevantPermissions.length === 0) {
    return [];
  }

  const draftPromises = relevantPermissions.map(async (permission) => {
    const info = draftPathToInfo.find(
      (index) => index.path === permission.modelName,
    );
    if (info == null) {
      return null;
    }
    const { resource, draftType } = info;

    try {
      const response = await fetchQuery<{
        data: ResourceDataType<DraftableResource>;
      }>(String(permission.instanceId), {
        accessTokenOverride: accessToken,
        resource,
        draft: true,
      });

      return {
        resourceType: draftType,
        data: response.data,
        userId: user.id,
      } as ResourceDraft;
    } catch {
      return null;
    }
  });

  const results = await Promise.all(draftPromises);
  return results.filter((draft) => draft !== null);
}

export const fetchDrafts = async () => {
  const authState = await getAuthStateServer();
  if (authState == null) {
    return [];
  }

  const { user, accessToken } = authState;

  if (isSolvroAdmin(user) || isAdmin(user)) {
    return await fetchDraftsForAdmins(accessToken);
  }
  return await fetchUserOwnedDrafts(user, accessToken);
};
