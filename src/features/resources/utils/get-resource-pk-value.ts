import { isEmptyValue, sanitizeId } from "@/utils";

import type { Resource } from "../enums";
import type { ResourceDataType } from "../types";
import { getFieldValue } from "./get-field-value";
import { getResourcePk } from "./get-resource-pk";

export function getResourcePkValue<T extends Resource>(
  resource: T,
  item: ResourceDataType<T>,
): string {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const unsanitizedPkValue = getFieldValue(item, getResourcePk(resource));
  if (isEmptyValue(unsanitizedPkValue)) {
    throw new Error(
      `Cannot obtain primary key value; resource: ${resource} item: ${JSON.stringify(item)}`,
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return sanitizeId(unsanitizedPkValue);
}
