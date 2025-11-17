import type { ZodNumber, ZodString } from "zod";

import type { Resource } from "@/features/resources";
import type { ResourcePk, ResourceSchemaKey } from "@/features/resources/types";

type OtherResources<T extends Resource> = Exclude<Resource, T>;
export type ListItemBadge<T extends Resource> = {
  [R in OtherResources<T>]?: ResourceSchemaKey<R, ZodString | ZodNumber>;
};
export interface ListItem<T extends Resource> {
  id: ResourcePk;
  name?: string;
  badges?: ListItemBadge<T>;
  shortDescription?: string | null;
}
