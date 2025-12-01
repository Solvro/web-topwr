import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import type { ReactNode } from "react";
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

/**
 * Configuration for a single state in a toggle (e.g., "Active" or "Inactive")
 */
export interface ToggleStateConfig<TValue = unknown> {
  /** The value this state represents (boolean or enum value) */
  value: TValue;
  /** Icon to display for this state */
  icon: LucideIcon;
  /** Tooltip text shown on hover */
  tooltip: string;
  /** Button variant (optional, defaults based on state) */
  variant?: "default" | "destructive-ghost" | "ghost" | "outline";
}

/**
 * Toast messages for a toggle action
 */
export interface ToggleToastMessages {
  /** Message shown while the API request is processing */
  loading: string;
  /** Message shown when toggle succeeds */
  success: string;
  /** Message shown when toggle fails */
  error: string;
}

/**
 * Configuration for a toggleable field on a resource
 */
export interface ToggleFieldConfig<_R extends Resource> {
  /** The field name to toggle (should be boolean or enum field from the schema) */
  field: string;
  /**
   * Array of exactly 2 states representing the toggle options.
   * First state = "off/inactive", Second state = "on/active"
   */
  states: readonly [ToggleStateConfig, ToggleStateConfig];
  /**
   * Custom toast messages for this toggle.
   * Function receives the current and next state for message customization.
   */
  getToastMessages: (
    fromState: ToggleStateConfig,
    toState: ToggleStateConfig,
  ) => ToggleToastMessages;
}

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

export interface ConfirmationMessageProps<R extends Resource> {
  item: ResourceFormValues<R>;
}

export interface SubmitFormConfirmationMessage<R extends Resource> {
  title: ReactNode;
  description: (props: ConfirmationMessageProps<R>) => ReactNode;
}

type SubmitFormConfiguration<R extends Resource> = Readonly<{
  submitLabel: string;
  submitIcon: LucideIcon;
  confirmationMessage?: SubmitFormConfirmationMessage<R>;
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
  /**
   * Whether the resource is a singleton (i.e., only one instance exists).
   * This means there is no `id` parameter in the *edit* route and there is no *create* route.
   * This can also be set to `true` for virtual resources, in which case
   * submission of a creation form will result in redirection to the index (collection) page.
   */
  isSingleton?: boolean;
  /** Whether the resource is orderable within the Abstract Resource List. */
  orderable?: boolean;
  /** Whether the resource can be deleted by the user. Defaults to true. */
  deletable?: boolean;
  /**
   * Configuration for a toggleable field in the resource list view.
   * Creates a button that switches between two states.
   * Limited to one toggle per resource for simplicity.
   */
  toggle?: ToggleFieldConfig<R>;
  /** A function that maps the API response to the client-side component rendered as `AbstractResourceListItem`. */
  itemMapper: (item: UnorderableResourceDataType<R>) => Omit<ListItem, "id">; // use the UnorderableResourceDataType here to avoid circular type reference
  form: {
    /** The inputs to be used in the form for the resource. */
    inputs: AbstractResourceFormInputs<R>;
    /** The default values to be used in the form for the resource. */
    defaultValues: ResourceFormValues<R>;
    /** Submit button label and icon overrides. */
    submitConfiguration?: {
      edit?: SubmitFormConfiguration<R>;
      create?: SubmitFormConfiguration<R>;
    };
  };
}>;

export type ResourceDefaultValues<R extends Resource> =
  | ResourceFormValues<R>
  | ResourceDataWithRelations<R>;
