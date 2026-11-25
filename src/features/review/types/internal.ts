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

export type DraftType = keyof typeof DRAFT_TYPE_RESOURCES;

/** Fields present on every draft model, in addition to the fields of the drafted resource. */
interface DraftFields<T extends DraftableResource> {
  /** The ID of the resource instance this draft proposes changes to, or `null` for drafts of new instances. */
  originalId?: number | null;
  /** The approved resource instance this draft proposes changes to, if requested. */
  original?: ResourceDataType<T> | null;
  createdByUserId?: number;
}

export type DraftData<T extends DraftableResource = DraftableResource> =
  ResourceDataType<T> & DraftFields<T>;

type ResourceDraftTypes = Invert<typeof DRAFT_TYPE_RESOURCES>;
export interface ResourceDraft<
  T extends DraftableResource = DraftableResource,
> {
  resourceType: ResourceDraftTypes[T];
  data: DraftData<T>;
}

export type DraftableResourceRelationMap = Partial<{
  [R in DraftableResource]: ResourceRelations<R>;
}>;
