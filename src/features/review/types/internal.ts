import type { Resource } from "@/features/resources";
import type {
  ResourceDataType,
  SpecificResourceMetadata,
} from "@/features/resources/types";
import type { ResourceRelations } from "@/types/components";
import type { Invert } from "@/types/helpers";

import type { DRAFT_TYPE_RESOURCES } from "../data/draft-type-resources";

export type DraftableResource = {
  [R in Resource]: SpecificResourceMetadata<R> extends { apiDraftPath: string }
    ? R
    : never;
}[Resource];

type ResourceDraftTypes = Invert<typeof DRAFT_TYPE_RESOURCES>;
export interface ResourceDraft<
  T extends DraftableResource = DraftableResource,
> {
  resourceType: ResourceDraftTypes[T];
  data: ResourceDataType<T>;
}

export type DraftableResourceRelationMap = Partial<{
  [R in DraftableResource]: ResourceRelations<R>;
}>;
