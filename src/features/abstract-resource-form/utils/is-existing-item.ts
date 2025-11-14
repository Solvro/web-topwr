import { get } from "react-hook-form";

import { getResourcePk } from "@/features/resources";
import type { Resource } from "@/features/resources";
import type {
  ResourceDataWithRelations,
  ResourceDefaultValues,
} from "@/features/resources/types";

/**
 * Determines whether the defaultValues represent an existing item or a new item.
 * Used to establish if this is the creation form or an edit form.
 */
export const isExistingItem = <T extends Resource>(
  resource: T,
  item: ResourceDefaultValues<T>,
): item is ResourceDataWithRelations<T> => {
  const value = get(item, getResourcePk(resource)) as unknown;
  return value != null && value !== "";
};
