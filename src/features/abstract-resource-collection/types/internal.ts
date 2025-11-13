import type { Id } from "@/features/resources/types";

export interface ListItem {
  id: Id;
  name?: string;
  shortDescription?: string | null;
}
