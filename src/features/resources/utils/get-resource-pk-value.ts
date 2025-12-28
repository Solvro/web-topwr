import { sanitizeId } from "@/utils";

import type { Resource } from "../enums";
import type { ResourceDataType } from "../types";
import { getFieldValue } from "./get-field-value";
import { getResourcePk } from "./get-resource-pk";

export function getResourcePkValue<T extends Resource>(
  resource: T,
  item: ResourceDataType<T>,
): string | number {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return sanitizeId(getFieldValue(item, getResourcePk(resource)));
}
