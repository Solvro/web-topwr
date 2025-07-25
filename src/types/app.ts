import type { z } from "zod";

import type { ERROR_CODES } from "@/config/constants";
import type { DeclensionCase, Resource } from "@/config/enums";
import type { RESOURCE_SCHEMAS } from "@/schemas/resources";

import type { DatedResource } from "./api";

export type ResourceSchema<T extends Resource> = (typeof RESOURCE_SCHEMAS)[T];
export type ResourceFormValues<T extends Resource> = z.infer<ResourceSchema<T>>;
export type ResourceDataType<T extends Resource> = DatedResource & {
  id: string;
} & ResourceFormValues<T>;

export interface ListItem {
  id: string;
  name?: string;
  shortDescription?: string | null;
}

export type ErrorCode = keyof typeof ERROR_CODES;

export interface Pluralized<T> {
  singular: T;
  plural: T;
}
export type Declensions = Record<DeclensionCase, string>;

export type AppZodObject = z.ZodObject<z.ZodRawShape>;
