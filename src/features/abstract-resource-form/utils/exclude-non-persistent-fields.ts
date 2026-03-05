import type { Resource } from "@/features/resources";
import type { ResourceFormValues } from "@/features/resources/types";

export function excludeNonPersistentFields<T extends Resource>(
  values: ResourceFormValues<T>,
  excludedFields: string[],
) {
  return Object.fromEntries(
    Object.entries(values).filter(([key]) => !excludedFields.includes(key)),
  );
}
