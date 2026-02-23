import type { Resource } from "@/features/resources";
import type {
  ResourceDataType,
  SpecificResourceMetadata,
} from "@/features/resources/types";
import type { ResourceRelations } from "@/types/components";

import type { RESOURCE_DRAFT_TYPES } from "../data/resource-draft-types";

export type DraftableResource = {
  [R in Resource]: SpecificResourceMetadata<R> extends { apiDraftPath: string }
    ? R
    : never;
}[Resource];

export interface ResourceDraft<
  T extends DraftableResource = DraftableResource,
> {
  resourceType: (typeof RESOURCE_DRAFT_TYPES)[T];
  data: ResourceDataType<T>;
}

export type DraftableResourceRelationMap = Partial<{
  [R in DraftableResource]: ResourceRelations<R>;
}>;
