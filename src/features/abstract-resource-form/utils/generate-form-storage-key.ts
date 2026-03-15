import { getResourcePkValue } from "@/features/resources";
import type { Resource } from "@/features/resources";
import type { ResourceDataWithRelations } from "@/features/resources/types";

export function generateFormStorageKey<T extends Resource>(
  resource: T,
  defaultValues: ResourceDataWithRelations<T>,
  isEditing: boolean,
  isEmbedded: boolean,
): string {
  const hasStartDate = "startDate" in defaultValues;
  const hasStartTime = "startTime" in defaultValues;
  const hasDate = "date" in defaultValues;
  const datePart = hasStartDate
    ? defaultValues.startDate
    : hasStartTime
      ? defaultValues.startTime
      : hasDate
        ? defaultValues.date
        : "";
  const storageKey = isEditing
    ? `${resource}-edit-${getResourcePkValue(resource, defaultValues)}`
    : `${resource}-create${isEmbedded ? "-embedded" : ""}${datePart ? `-${datePart}` : ""}`;
  return storageKey;
}
