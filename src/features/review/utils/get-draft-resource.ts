import { typedEntries } from "@/utils";

import { RESOURCE_DRAFT_TYPES } from "../data/resource-draft-types";
import type { DraftableResource, ResourceDraft } from "../types/internal";

export const getDraftResource = <R extends DraftableResource>(
  draft: ResourceDraft<R>,
): R => {
  const entry = typedEntries(RESOURCE_DRAFT_TYPES).find(
    ([_, type]) => type === draft.resourceType,
  );
  if (entry == null) {
    throw new Error(`Unknown draft resource type: ${draft.resourceType}`);
  }
  const [resource] = entry;
  return resource as R;
};
