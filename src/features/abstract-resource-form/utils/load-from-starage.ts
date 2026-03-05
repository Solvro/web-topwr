import { logger, parseError } from "@/features/logging";
import type { Resource } from "@/features/resources";

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

    const maxAge = 24 * 60 * 60 * 1000;
    if (Date.now() - parsed.timestamp > maxAge) {
      localStorage.removeItem(fullStorageKey);
      return null;
    }

    return parsed;
  } catch (error) {
    logger.error(
      parseError(error),
      "Failed to load form data from localStorage",
    );
    return null;
  }
}
