import type { RefObject } from "react";

import type { Resource } from "@/features/resources";
import type { ResourceFormValues } from "@/features/resources/types";

import { saveToStorage } from "./save-to-storage";

export function debouncedSave<T extends Resource>(
  values: ResourceFormValues<T>,
  debounceTimerRef: RefObject<NodeJS.Timeout | undefined>,
  debounceMs: number,
  enabled: boolean,
  fullStorageKey: string,
  excludedFields: string[] = [],
) {
  if (debounceTimerRef.current != null) {
    clearTimeout(debounceTimerRef.current);
  }

  debounceTimerRef.current = setTimeout(() => {
    saveToStorage(enabled, values, fullStorageKey, excludedFields);
  }, debounceMs);
}
