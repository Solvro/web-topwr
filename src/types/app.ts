import type { DefaultValues } from "react-hook-form";
import type { z } from "zod";

import type { ERROR_CODES } from "@/config/constants";
import type { DeclensionCase, Resource } from "@/config/enums";
import type {
  NOUN_PHRASE_TRANSFORMATIONS,
  SIMPLE_NOUN_DECLENSIONS,
} from "@/config/polish";
import type { ORDERABLE_RESOURCES } from "@/config/resources";
import type { RESOURCE_SCHEMAS } from "@/schemas";

import type { DatedResource } from "./api";
import type { AbstractResourceFormInputs } from "./forms";

export type Id = string | number;
export type ListItemMapper<R extends Resource> = (
  item: ResourceDataType<R>,
) => Omit<ListItem, "id">;

export type OrderableResource = (typeof ORDERABLE_RESOURCES)[number];
export type ResourceSchema<T extends Resource> = (typeof RESOURCE_SCHEMAS)[T];
export type ResourceFormValues<T extends Resource> = z.infer<ResourceSchema<T>>;
export type ResourceDataType<T extends Resource> = DatedResource &
  ResourceFormValues<T> &
  (T extends OrderableResource ? { id: Id; order: number } : { id: Id });
export type ResourceDefaultValues<R extends Resource> = ResourceFormValues<R> &
  DefaultValues<ResourceFormValues<R> | ResourceDataType<R>>;

export interface ResourceMetadata<R extends Resource> {
  /** A mapping of the client-side resources to their paths in the backend API. */
  apiPath: string;
  /** A function that maps the API response to the client-side component rendered as `AbstractResourceListItem`. */
  itemMapper: ListItemMapper<R>;
  form: {
    /** The inputs to be used in the form for the resource. */
    inputs: AbstractResourceFormInputs<R>;
    /** The default values to be used in the form for the resource. */
    defaultValues: ResourceDefaultValues<R>;
  };
}

export interface ListItem {
  id: Id;
  name?: string;
  shortDescription?: string | null;
}

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

export type Declensions = Record<DeclensionCase, string>;

export type DeclinableSimpleNoun = keyof typeof SIMPLE_NOUN_DECLENSIONS;
export type DeclinableNounPhrase = keyof typeof NOUN_PHRASE_TRANSFORMATIONS;
export type DeclinableNoun = DeclinableSimpleNoun | DeclinableNounPhrase;

export type AppZodObject = z.ZodObject<z.ZodRawShape>;

/** Extracts from the fields of a resource only those which have defined translations and declinations in Polish. */
export type ResourceDeclinableField<T extends Resource> =
  keyof ResourceDataType<T> & DeclinableNoun;

export interface ResourceEditPageProps {
  params: Promise<{ id: string }>;
}
