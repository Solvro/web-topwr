import type { z } from "zod";

import type { DeclinableNoun } from "@/features/polish/types";
import type { ResourceSchemaKey, SelectInputOptions } from "@/types/forms";

import type { RESOURCE_METADATA } from "../data/resource-metadata";
import type { RelationType, Resource } from "../enums";
import type {
  ArrayResources,
  ResourceDataType,
  SpecificResourceMetadata,
} from "./internal";

/** For a given resource `T`, this type returns the union of all resources to which it is related. */
export type ResourceRelation<T extends Resource> = {
  [R in Resource]: SpecificResourceMetadata<R>["form"]["inputs"] extends {
    relationInputs: Record<infer L extends Resource, unknown>;
  }
    ? L
    : never;
}[T];
/** The union of all types which need to be prefetched when fetching this resource's data. */
export type RelatedResource<T extends Resource> =
  | ResourceRelation<T>
  | ArrayResources<T>;
/** For a given resource `T`, this type returns the union of all resources which are used as a pivot resource between `T` and `ResourceRelation<T>`. */
export type ResourcePivotRelation<T extends Resource> = {
  [R in Resource]: SpecificResourceMetadata<R>["form"]["inputs"] extends {
    relationInputs: Record<string, unknown>;
  }
    ? SpecificResourceMetadata<R>["form"]["inputs"]["relationInputs"][ResourceRelation<T>] extends {
        pivotData: { relatedResource: infer P extends Resource };
      }
      ? P
      : never
    : never;
}[T];
export type ResourcePivotRelationData<T extends Resource> = {
  [R in ResourcePivotRelation<T>]: ResourceDataType<R>[];
};
interface PivotDataDefinitionBase {
  field: string;
}
export interface RelationPivotDataDefinition extends PivotDataDefinitionBase {
  relatedResource: Resource;
}
export type EnumPivotDataDefinition = PivotDataDefinitionBase &
  SelectInputOptions;
export type PivotDataDefinition =
  | RelationPivotDataDefinition
  | EnumPivotDataDefinition;
export interface PivotRelationDefinition {
  type: RelationType.ManyToMany;
  foreignKey?: never;
  label?: DeclinableNoun;
  pivotData?: PivotDataDefinition;
}
/** Relation definitions between T and L, where T is the main resource and L is the related resource. */
export type RelationDefinition<T extends Resource, L extends Resource> =
  | PivotRelationDefinition
  | {
      type: RelationType.OneToMany;
      foreignKey: ResourceSchemaKey<L, z.ZodString | z.ZodNumber>;
    }
  | {
      type: RelationType.ManyToOne;
      foreignKey: ResourceSchemaKey<T, z.ZodString | z.ZodNumber>;
    };
export type RelationDefinitions<T extends Resource> = {
  [L in Resource]?: RelationDefinition<T, L>;
};

/** Represents Resources which are part of a one-to-many or many-to-many relation. */
export type XToManyResource = {
  [R in Resource]: (typeof RESOURCE_METADATA)[R] extends { queryName: string }
    ? R
    : never;
}[Resource];

export type RelationQueryName<T extends XToManyResource> =
  (typeof RESOURCE_METADATA)[T]["queryName"];
type QueriedRelations<T extends Resource> = {
  [L in XToManyResource as RelationQueryName<L>]: L extends ResourceRelation<T>
    ? ResourceDataType<L>[]
    : never;
};
export type ResourceDataWithRelations<R extends Resource> =
  ResourceDataType<R> & QueriedRelations<R>;
