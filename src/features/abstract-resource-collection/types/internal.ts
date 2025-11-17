import type { ZodNumber, ZodString } from "zod";

import type { Resource } from "@/features/resources";
import type { ResourcePk, ResourceSchemaKey } from "@/features/resources/types";

export type ListItemBadge = {
  [R in Resource]?: ResourceSchemaKey<R, ZodString | ZodNumber>;
};
export interface ListItem {
  id: ResourcePk;
  name?: string;
  badges?: ListItemBadge;
  shortDescription?: string | null;
}
