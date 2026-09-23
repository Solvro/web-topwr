import type { Resource } from "@/features/resources";
import { getResourceMetadata } from "@/features/resources/node";
import type { ResourcePk } from "@/features/resources/types";

import type { User } from "../types/internal";
import { canManageAllDrafts } from "./can-manage-all-drafts";
import { hasModelPermission } from "./has-model-permission";

/** Whether the user is allowed to create a draft with changes to the given resource instance. */
export function canSuggestResourceEdit(
  user: User | null,
  resource: Resource,
  id: ResourcePk,
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
    hasModelPermission(user, "suggest_edit", apiPath, id)
  );
}
