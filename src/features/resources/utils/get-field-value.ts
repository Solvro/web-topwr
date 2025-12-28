import { get } from "react-hook-form";
import type { z } from "zod";

import type { Resource } from "../enums";
import type {
  ResourceDataType,
  ResourceFormValues,
  ResourceSchemaKey,
} from "../types";

/**
 * Retrieves the value of a specific field from a resource item using the key's path.
 * Essentially a typed wrapper around `react-hook-form`'s `get` function.
 */
export const getFieldValue = <
  T extends Resource,
  S extends z.ZodString | z.ZodNumber,
>(
  item: ResourceDataType<T> | Partial<ResourceFormValues<T>>,
  field: ResourceSchemaKey<T, S>,
  defaultValue?: z.infer<S>,
) => get(item, field, defaultValue) as z.infer<S>;
