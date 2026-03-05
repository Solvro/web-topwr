import { logger, parseError } from "@/features/logging";
import type { Resource } from "@/features/resources";
import type { ResourceFormValues } from "@/features/resources/types";

import type { PersistedFormData } from "../types/internal";
import { excludeNonPersistentFields } from "./exclude-non-persistent-fields";

export function saveToStorage<T extends Resource>(
  enabled: boolean,
  values: ResourceFormValues<T>,
  fullStorageKey: string,
  excludedFields: string[] = [],
) {
  if (!enabled) {
    return;
  }

  try {
    const filteredValues = excludeNonPersistentFields(
      values,
      excludedFields,
    ) as ResourceFormValues<T>;
    const persistedData: PersistedFormData<T> = {
      values: filteredValues,
      timestamp: Date.now(),
    };
    localStorage.setItem(fullStorageKey, JSON.stringify(persistedData));
  } catch (error) {
    logger.error(parseError(error), "Failed to save form data to localStorage");
  }
}
