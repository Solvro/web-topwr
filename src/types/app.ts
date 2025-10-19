import type { ReactNode } from "react";
import type { DefaultValues } from "react-hook-form";
import type { z } from "zod";

import type { ERROR_CODES } from "@/config/constants";
import type { DeclensionCase, Resource } from "@/config/enums";
import type {
  DETERMINER_DECLENSIONS,
  NOUN_PHRASE_TRANSFORMATIONS,
  SIMPLE_NOUN_DECLENSIONS,
} from "@/config/polish";
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
export type ResourceDefaultValues<R extends Resource> = ResourceFormValues<R> &
  DefaultValues<ResourceFormValues<R> | ResourceDataType<R>>;

// Relations
export type ResourceRelation<T extends Resource> = {
  [R in Resource]: (typeof RESOURCE_METADATA)[R]["form"]["inputs"] extends {
    relationInputs: Record<infer L, unknown>;
  }
    ? L
    : never;
}[T];

export type RelationResource = {
  [R in Resource]: (typeof RESOURCE_METADATA)[R] extends { queryName: string }
    ? R
    : never;
}[Resource];

export type RelationQueryName<T extends RelationResource> =
  (typeof RESOURCE_METADATA)[T]["queryName"];
export type QueriedRelations<T extends Resource> = {
  [L in RelationResource as RelationQueryName<L>]: L extends ResourceRelation<T>
    ? ResourceDataType<L>[]
    : never;
};

// Resource metadata
export type ResourceMetadata<R extends Resource> = Readonly<{
  /** The name of the query param used to fetch the related resource from the API, if this is a relation. */
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
    defaultValues: ResourceDefaultValues<R>;
  };
}>;

// Polish grammar
export type Declensions = Record<DeclensionCase, string>;
export type DeclinableSimpleNoun = keyof typeof SIMPLE_NOUN_DECLENSIONS;
export type DeclinableNounPhrase = keyof typeof NOUN_PHRASE_TRANSFORMATIONS;
export type DeclinableNoun = DeclinableSimpleNoun | DeclinableNounPhrase;
/** Extracts from the fields of a resource only those which have defined translations and declinations in Polish. */
export type ResourceDeclinableField<T extends Resource> =
  keyof ResourceDataType<T> & DeclinableNoun;
export type Determiner = keyof typeof DETERMINER_DECLENSIONS;

// Component types
export type ErrorCode = keyof typeof ERROR_CODES;
export type SortDirection = "asc" | "desc";

export interface SortFiltersOptions {
  sortBy: DeclinableNoun | "";
  sortDirection: SortDirection;
  searchField: DeclinableNoun | "";
  searchTerm: string;
}

/** The accepted search parameters for the abstract resource list. */
export interface ListSearchParameters {
  page?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  searchField?: string;
  searchTerm?: string;
}

export type ResourceEditPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export type ResourcePageProps = Readonly<{
  searchParams: Promise<{ page?: string }>;
}>;

export type LayoutProps = Readonly<{
  children: ReactNode;
}>;

export interface ResourceFormSheetDataContent<T extends Resource> {
  resource: ResourceRelation<T>;
  form: ReactNode;
  item: {
    id: Id;
    name: string | undefined;
  } | null;
}

export type ResourceFormSheetData<T extends Resource> =
  | {
      visible: true;
      content: ResourceFormSheetDataContent<T>;
    }
  | {
      visible: false;
      content?: ResourceFormSheetDataContent<T>;
    };
