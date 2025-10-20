import type { z } from "zod";

import type { RelationType, Resource } from "@/config/enums";
import type {
  ORDERABLE_RESOURCES,
  RESOURCE_METADATA,
} from "@/config/resources";
import type { RESOURCE_SCHEMAS } from "@/schemas";

import type { DatedResource } from "./api";
import type { AbstractResourceFormInputs, ResourceSchemaKey } from "./forms";

// Data types
export type Id = string | number;
export interface ListItem {
  id: Id;
  name?: string;
  shortDescription?: string | null;
}
export type AppZodObject = z.ZodObject<z.ZodRawShape>;

// Resource helpers
export type OrderableResource = (typeof ORDERABLE_RESOURCES)[number];
export type ResourceSchema<T extends Resource> = (typeof RESOURCE_SCHEMAS)[T];
export type ResourceFormValues<T extends Resource> = z.infer<ResourceSchema<T>>;
type PossiblyOrderable<T extends Resource, U> = T extends OrderableResource
  ? U & { order: number }
  : U;
export type ResourceDataType<T extends Resource> = PossiblyOrderable<
  T,
  DatedResource & ResourceFormValues<T> & { id: Id }
>;

// Relations
/** For a given resource `T`, this type returns the union of all resources to which it is related. */
export type ResourceRelation<T extends Resource> = {
  [R in Resource]: (typeof RESOURCE_METADATA)[R]["form"]["inputs"] extends {
    relationInputs: Record<infer L, unknown>;
  }
    ? L
    : never;
}[T];
/** Relation definitions between T and L, where T is the main resource and L is the related resource. */
export type RelationDefinition<T extends Resource, L extends Resource> =
  | {
      type: RelationType.ManyToMany;
      foreignKey?: never;
    }
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
export type QueriedRelations<T extends Resource> = {
  [L in XToManyResource as RelationQueryName<L>]: L extends ResourceRelation<T>
    ? ResourceDataType<L>[]
    : never;
};
export type ResourceDefaultValues<R extends Resource> =
  | ResourceFormValues<R>
  | (ResourceDataType<R> & QueriedRelations<R>);

// Resource metadata
export type ResourceMetadata<R extends Resource> = Readonly<{
  /** The name of the query param used to fetch the related resource from the API, if this is the related resource in a m:n relation. */
  queryName?: string;
  /** The primary key field in the resource schema, if not `"id"`. */
  pk?: ResourceSchemaKey<R, z.ZodString | z.ZodNumber>;
  /** A mapping of the client-side resources to their paths in the backend API. */
  apiPath: string;
  /** A function that maps the API response to the client-side component rendered as `AbstractResourceListItem`. */
  itemMapper: (item: ResourceDataType<R>) => Omit<ListItem, "id">;
  form: {
    /** The inputs to be used in the form for the resource. */
    inputs: AbstractResourceFormInputs<R>;
    /** The default values to be used in the form for the resource. */
    defaultValues: ResourceFormValues<R>;
  };
}>;
