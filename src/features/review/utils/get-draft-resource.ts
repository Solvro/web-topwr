import { DRAFT_TYPE_RESOURCES } from "../data/draft-type-resources";
import type { DraftableResource, ResourceDraft } from "../types/internal";

export const getDraftResource = <R extends DraftableResource>(
  draft: ResourceDraft<R>,
): R => {
  const resource = DRAFT_TYPE_RESOURCES[draft.resourceType];
  // TODO: double cast should not be necessary
  return resource as DraftableResource as R;
};
