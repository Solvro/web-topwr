import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import type { z } from "zod";

import type { RelationType, Resource } from "@/config/enums";
import type { RESOURCE_METADATA } from "@/config/resource-metadata";
import type { RESOURCE_SCHEMAS } from "@/schemas";

import type { DatedResource } from "./api";
import type {
  AbstractResourceFormInputs,
  ResourceSchemaKey,
  SelectInputOptions,
} from "./forms";
import type { DeclinableNoun } from "./polish";

// Data types
export type Id = string | number;
export interface ListItem {
  id: Id;
  name?: string;
  shortDescription?: string | null;
}
export type AppZodObject = z.ZodObject<z.ZodRawShape>;

// Resource helpers
export type RoutableResource = {
  [R in Resource]: `/${R}` extends Route ? R : never;
}[Resource];
export type CreatableResource = {
  [R in Resource]: `/${R}/create` extends Route ? R : never;
}[Resource];
export type EditableResource = {
  [R in Resource]: `/${R}/edit/${string}` extends Route<`/${R}/edit/${infer _}`>
    ? R
    : never;
}[Resource];
type SpecificResourceMetadata<R extends Resource> =
  (typeof RESOURCE_METADATA)[R];
export type OrderableResource = {
  [R in Resource]: SpecificResourceMetadata<R> extends { orderable: true }
    ? R
    : never;
}[Resource] &
  RoutableResource;
export type ResourceSchema<T extends Resource> = (typeof RESOURCE_SCHEMAS)[T];
export type ResourceFormValues<T extends Resource> = z.infer<ResourceSchema<T>>;
type PossiblyOrderable<T extends Resource, U> = T extends OrderableResource
  ? U & { order: number }
  : U;
type UnorderableResourceDataType<T extends Resource> = DatedResource &
  ResourceFormValues<T> & { id: Id };
export type ResourceDataType<T extends Resource> = PossiblyOrderable<
  T,
  UnorderableResourceDataType<T>
>;

// Relations
/** For a given resource `T`, this type returns the union of all resources to which it is related. */
export type ResourceRelation<T extends Resource> = {
  [R in Resource]: SpecificResourceMetadata<R>["form"]["inputs"] extends {
    relationInputs: Record<infer L extends Resource, unknown>;
  }
    ? L
    : never;
}[T];
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
export type ResourceDefaultValues<R extends Resource> =
  | ResourceFormValues<R>
  | ResourceDataWithRelations<R>;

export type SubmitFormConfiguration = Readonly<{
  submitLabel: string;
  submitIcon: LucideIcon;
}>;

// Resource metadata
export type ResourceMetadata<R extends Resource> = Readonly<{
  /** The name of the query param used to fetch this resource from the API, if this is the related resource in a 1-m:n relation. */
  queryName?: string;
  /** The primary key field in the resource schema, if not `"id"`. */
  pk?: ResourceSchemaKey<R, z.ZodString | z.ZodNumber>;
  /** A mapping of the client-side resources to their paths in the backend API. */
  apiPath: string;
  /** The API version to be used when fetching this resource. Defaults to 1. */
  apiVersion?: number;
  /** Whether the resource is a singleton (i.e., only one instance exists). */
  isSingleton?: boolean;
  /** Whether the resource is orderable within the Abstract Resource List. */
  orderable?: boolean;
  /** A function that maps the API response to the client-side component rendered as `AbstractResourceListItem`. */
  itemMapper: (item: UnorderableResourceDataType<R>) => Omit<ListItem, "id">; // use the UnorderableResourceDataType here to avoid circular type reference
  form: {
    /** The inputs to be used in the form for the resource. */
    inputs: AbstractResourceFormInputs<R>;
    /** The default values to be used in the form for the resource. */
    defaultValues: ResourceFormValues<R>;
    /** Submit button label and icon overrides. */
    submitConfiguration?: {
      edit?: SubmitFormConfiguration;
      create?: SubmitFormConfiguration;
    };
  };
}>;
