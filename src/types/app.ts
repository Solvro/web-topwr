import type { z } from "zod";

import type { ERROR_CODES, NOUN_DECLENSIONS } from "@/config/constants";
import type { DeclensionCase, Resource } from "@/config/enums";
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

export interface Pluralized<T extends Record<string, unknown>> {
  singular: T;
  plural: { [K in keyof T]: T[K] };
}
export type Declensions = Record<DeclensionCase, string>;

export type DeclinableNoun = keyof typeof NOUN_DECLENSIONS;

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
