import { get } from "react-hook-form";

import type { Resource } from "@/config/enums";
import { getResourcePk } from "@/lib/helpers";
import type {
  ResourceDataWithRelations,
  ResourceDefaultValues,
} from "@/types/app";

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
