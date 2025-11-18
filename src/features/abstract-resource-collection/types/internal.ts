import type { ZodNumber, ZodString } from "zod";

import type { Resource } from "@/features/resources";
import type { ResourcePk, ResourceSchemaKey } from "@/features/resources/types";

export interface ItemBadge {
  displayField: string;
  variant: ItemBadgeVariant;
  customColors?: { color1: string; color2: string };
}
export type ItemBadgeVariant = "default" | "primary";
type OtherResources<T extends Resource> = Exclude<Resource, T>;
export type ListItemBadge<T extends Resource> = {
  [R in OtherResources<T>]?: {
    displayField: ResourceSchemaKey<R, ZodString | ZodNumber>;
    variant: ItemBadgeVariant;
  };
};
export interface ListItem<T extends Resource> {
  id: ResourcePk;
  name?: string;
  badges?: ListItemBadge<T>;
  shortDescription?: string | null;
}
