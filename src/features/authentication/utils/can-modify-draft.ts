import type { Resource } from "@/features/resources";
import { getResourceMetadata } from "@/features/resources/node";
import type { ResourcePk } from "@/features/resources/types";

import type { User } from "../types/internal";
import { canManageAllDrafts } from "./can-manage-all-drafts";
import { hasModelPermission } from "./has-model-permission";

/** Whether the user can modify (`update`) or delete (`destroy`) the given draft. */
export function canModifyDraft(
  user: User | null,
  resource: Resource,
  draft: { id: ResourcePk; createdByUserId?: number | null },
  action: "update" | "destroy" = "update",
): boolean {
  if (user == null) {
    return false;
  }
  if (canManageAllDrafts(user) || draft.createdByUserId === user.id) {
    return true;
  }
  const { apiDraftPath } = getResourceMetadata(resource);
  return (
    apiDraftPath != null &&
    hasModelPermission(user, action, apiDraftPath, draft.id)
  );
}
