import { logger, parseError } from "@/features/logging";
import type { Resource } from "@/features/resources";

import { MAX_PERSISTED_DATA_AGE_MS } from "../constants";
import type { PersistedFormData } from "../types/internal";

export function loadFromStorage<T extends Resource>(
  enabled: boolean,
  fullStorageKey: string,
): PersistedFormData<T> | null {
  if (!enabled) {
    return null;
  }

  try {
    const stored = localStorage.getItem(fullStorageKey);
    if (stored == null) {
      return null;
    }

    const parsed = JSON.parse(stored) as PersistedFormData<T>;

    if (Date.now() - parsed.timestamp > MAX_PERSISTED_DATA_AGE_MS) {
      localStorage.removeItem(fullStorageKey);
      return null;
    }

    return parsed;
  } catch (error) {
    logger.error(
      parseError(error),
      "Failed to load form data from localStorage",
    );
    localStorage.removeItem(fullStorageKey);
    return null;
  }
}
