import type { z } from "zod";

import type { ERROR_CODES } from "@/config/constants";
import type { DeclensionCase, Resource } from "@/config/enums";
import type {
  NOUN_PHRASE_TRANSFORMATIONS,
  SIMPLE_NOUN_DECLENSIONS,
} from "@/config/polish";
import type { RESOURCE_SCHEMAS } from "@/schemas";

import type { DatedResource } from "./api";

export type Id = string | number;

export type ResourceSchema<T extends Resource> = (typeof RESOURCE_SCHEMAS)[T];
export type ResourceFormValues<T extends Resource> = z.infer<ResourceSchema<T>>;
export type ResourceDataType<T extends Resource> = DatedResource & {
  id: Id;
} & ResourceFormValues<T>;

export interface ListItem {
  id: Id;
  name?: string;
  shortDescription?: string | null;
}

export type ErrorCode = keyof typeof ERROR_CODES;

export type SortDirection = "asc" | "desc";

export interface SortFiltersOptions {
  sortBy: DeclinableNoun;
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

export interface Pluralized<T extends Record<string, unknown>> {
  singular: T;
  plural: { [K in keyof T]: T[K] };
}
export type Declensions = Record<DeclensionCase, string>;

export type DeclinableSimpleNoun = keyof typeof SIMPLE_NOUN_DECLENSIONS;
export type DeclinableNounPhrase = keyof typeof NOUN_PHRASE_TRANSFORMATIONS;
export type DeclinableNoun = DeclinableSimpleNoun | DeclinableNounPhrase;

export type AppZodObject = z.ZodObject<z.ZodRawShape>;

/**
 * A record which must contain all keys from type K and all keys from type J.
 * Useful when combining a record of a specific type and a record of strings,
 * which prevents the string keys from absorbing the specific type keys
 * due to them being more generic.
 */
export type RecordIntersection<
  K extends string | number | symbol,
  J extends string | number | symbol,
  V,
> = Record<K, V> & Record<J, V>;

/** Extracts from the fields of a resource only those which have defined translations and declinations in Polish. */
export type ResourceDeclinableField<T extends Resource> =
  keyof ResourceDataType<T> & DeclinableNoun;

export interface ResourceEditPageProps {
  params: Promise<{ id: string }>;
}
