import { ArlItem } from "@/features/abstract-resource-list";

import type {
  DraftableResource,
  DraftableResourceRelationMap,
  ResourceDraft,
} from "../types/internal";
import { getDraftResource } from "../utils/get-draft-resource";

export function DraftItem<R extends DraftableResource>({
  draft,
  relatedResourcesMap,
}: {
  draft: ResourceDraft<R>;
  relatedResourcesMap: DraftableResourceRelationMap;
}) {
  const resource = getDraftResource(draft);
  const relatedResources = relatedResourcesMap[resource];
  if (relatedResources == null) {
    throw new Error(`Relations not found for draft resource ${resource}`);
  }

  return (
    <ArlItem
      resource={resource}
      item={draft.data}
      relatedResources={relatedResources}
    />
  );
}
