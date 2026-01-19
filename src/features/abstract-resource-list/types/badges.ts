import type { Route } from "next";
import type { ZodNumber, ZodString } from "zod";

import type { Resource } from "@/features/resources";
import type {
  RelatedResource,
  ResourceSchemaKey,
} from "@/features/resources/types";

export interface ItemBadge {
  displayField: string;
  color?: string;
  editRoute?: Route;
}

export interface BadgeConfig<R extends Resource> {
  displayField: ResourceSchemaKey<R, ZodString | ZodNumber>;
  colorField?: ResourceSchemaKey<R, ZodString>;
}

export type ResourceBadgeDefinitions<R extends Resource> = {
  [Related in RelatedResource<R>]?: BadgeConfig<Related>;
};
