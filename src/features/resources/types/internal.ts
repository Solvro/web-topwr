import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import type { z } from "zod";

import type { ListItem } from "@/features/abstract-resource-collection/types";
import type { AbstractResourceFormInputs } from "@/features/abstract-resource-form/types";
import type { DatedResource } from "@/features/backend/types";
import type { TypedSchemaKey } from "@/types/schemas";

import type { RESOURCE_METADATA } from "../data/resource-metadata";
import type { RESOURCE_SCHEMAS } from "../data/resource-schemas";
import type { Resource } from "../enums";
import type { ResourceDataWithRelations } from "./relations";

export type ResourcePk = string | number;

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
export type SpecificResourceMetadata<R extends Resource> =
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
  ResourceFormValues<T> & { id: ResourcePk };
export type ResourceDataType<T extends Resource> = PossiblyOrderable<
  T,
  UnorderableResourceDataType<T>
>;

/**
 * Extracts all paths to the form values of T, such that the type of the value at that path extends Y.
 * @param T - Resource to extract schema paths from
 * @param Y - Zod type to filter paths by (defaults to ZodTypeAny)
 * @example type BooleanPaths = ResourceSchemaKey<Resource.StudentOrganizations, z.ZodBoolean> // yields 'isStrategic' | 'coverPreview' as those are the only boolean fields defined in the schema
 */
export type ResourceSchemaKey<
  T extends Resource,
  Y extends z.ZodTypeAny = z.ZodTypeAny,
> = TypedSchemaKey<ResourceSchema<T>, Y>;

/** For a given resource `T`, this type returns the union of all resources which it uses in its array input fields. */
export type ArrayResources<T extends Resource> = {
  [R in Resource]: SpecificResourceMetadata<R>["form"]["inputs"] extends {
    arrayInputs: Record<string, { itemsResource: infer L extends Resource }>;
  }
    ? L
    : never;
}[T];

type SubmitFormConfiguration = Readonly<{
  submitLabel: string;
  submitIcon: LucideIcon;
}>;

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

export type ResourceDefaultValues<R extends Resource> =
  | ResourceFormValues<R>
  | ResourceDataWithRelations<R>;
