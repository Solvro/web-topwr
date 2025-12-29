import type { ResourcePk } from "@/features/resources/types";

export interface ListItem {
  id: ResourcePk;
  name?: string;
  shortDescription?: string | null;
}
