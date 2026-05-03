import { ArlItem } from "@/features/abstract-resource-list";
import { isAdmin, isSolvroAdmin } from "@/features/authentication";
import type { AuthState } from "@/features/authentication/types";

import type {
  DraftableResource,
  DraftableResourceRelationMap,
  ResourceDraft,
} from "../types/internal";
import { getDraftResource } from "../utils/get-draft-resource";
import { DraftEditButton } from "./draft-edit-button";

export function DraftItem<R extends DraftableResource>({
  draft,
  relatedResourcesMap,
  authState,
}: {
  draft: ResourceDraft<R>;
  relatedResourcesMap: DraftableResourceRelationMap;
  authState: AuthState;
}) {
  const resource = getDraftResource(draft);
  const relatedResources = relatedResourcesMap[resource];
  if (relatedResources == null) {
    throw new Error(`Relations not found for draft resource ${resource}`);
  }

  const canEdit =
    isSolvroAdmin(authState.user) ||
    isAdmin(authState.user) ||
    draft.userId === authState.user.id;

  return (
    <ArlItem
      resource={resource}
      item={draft.data}
      relatedResources={relatedResources}
      actions={
        canEdit ? (
          <DraftEditButton resource={resource} id={draft.data.id} />
        ) : null
      }
    />
  );
}
