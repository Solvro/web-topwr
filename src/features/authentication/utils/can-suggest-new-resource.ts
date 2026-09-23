import type { Resource } from "@/features/resources";
import { getResourceMetadata } from "@/features/resources/node";

import type { User } from "../types/internal";
import { canManageAllDrafts } from "./can-manage-all-drafts";
import { hasModelPermission } from "./has-model-permission";

/** Whether the user is allowed to create a draft of a new instance of the given resource. */
export function canSuggestNewResource(
  user: User | null,
  resource: Resource,
): boolean {
  const { apiPath, apiDraftPath } = getResourceMetadata(resource);
  if (apiDraftPath == null) {
    return false;
  }
  if (canManageAllDrafts(user)) {
    return true;
  }
  return (
    hasModelPermission(user, "create", apiDraftPath) &&
    hasModelPermission(user, "suggest_new", apiPath)
  );
}
