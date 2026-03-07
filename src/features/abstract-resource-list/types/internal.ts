import type { ResourcePk } from "@/features/resources/types";

export interface ListItem {
  id: ResourcePk;
  /** The value shown in the resource list and in select inputs for related resources */
  name?: string;
  /** The value shown in italics next to the name in the resource list */
  descriptor?: string | null;
  /** The optional value shown under the name in the resource list */
  description?: string | null;
}
