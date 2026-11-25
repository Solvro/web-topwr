import { ArlItem } from "@/features/abstract-resource-list";
import { canApproveDrafts, canModifyDraft } from "@/features/authentication";
import type { User } from "@/features/authentication/types";
import {
  DeleteButtonWithDialog,
  getResourceMetadata,
} from "@/features/resources";

import type {
  DraftableResource,
  DraftableResourceRelationMap,
  ResourceDraft,
} from "../types/internal";
import { getDraftBadges } from "../utils/get-draft-badges";
import { getDraftResource } from "../utils/get-draft-resource";
import { ApproveButton } from "./approve-button";
import { DraftEditButton } from "./draft-edit-button";

export function DraftItem<R extends DraftableResource>({
  draft,
  relatedResourcesMap,
  user,
}: {
  draft: ResourceDraft<R>;
  relatedResourcesMap: DraftableResourceRelationMap;
  user: User;
}) {
  const resource = getDraftResource(draft);
  const relatedResources = relatedResourcesMap[resource];
  if (relatedResources == null) {
    throw new Error(`Relations not found for draft resource ${resource}`);
  }
  const { id } = draft.data;
  const itemName = getResourceMetadata(resource).itemMapper(draft.data).name;

  return (
    <ArlItem
      resource={resource}
      item={draft.data}
      relatedResources={relatedResources}
      extraBadges={getDraftBadges(resource, draft.data)}
      actions={
        <>
          {canModifyDraft(user, resource, draft.data, "update") ? (
            <DraftEditButton resource={resource} id={id} />
          ) : null}
          {canApproveDrafts(user) ? (
            <ApproveButton
              resource={resource}
              id={id}
              itemName={itemName}
              redirectOnSuccess={false}
            />
          ) : null}
          {canModifyDraft(user, resource, draft.data, "destroy") ? (
            <DeleteButtonWithDialog
              resource={resource}
              id={id}
              itemName={itemName}
              isDraft
            />
          ) : null}
        </>
      }
    />
  );
}
