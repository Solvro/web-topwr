"use client";

import { useEffect, useRef } from "react";
import type { Path } from "react-hook-form";

import { logger, parseError } from "@/features/logging";
import type { Resource } from "@/features/resources";
import type { ResourceFormValues } from "@/features/resources/types";
import { typedEntries } from "@/utils";

import { LOCAL_STORAGE_ENTRY_PREFIX } from "../constants";
import type { FormPersistenceOptions } from "../types/internal";
import { debouncedSave } from "../utils/debounced-save";
import { isFormStateDirty } from "../utils/is-form-state-dirty";
import { loadFromStorage } from "../utils/load-from-storage";

/**
 * Hook that automatically persists form data to localStorage and restores it on component mount.
 */
export function useFormPersistence<T extends Resource>({
  storageKey,
  form,
  enabled = true,
  debounceMs = 1000,
  excludedFields,
  isEditing = false,
}: FormPersistenceOptions<T>) {
  const isPersistenceActive = enabled && !isEditing;
  const fullStorageKey = `${LOCAL_STORAGE_ENTRY_PREFIX}${storageKey}`;
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const hasRestoredRef = useRef(false);

  const clearLocalStorageData = () => {
    try {
      localStorage.removeItem(fullStorageKey);
      hasRestoredRef.current = false;
    } catch (error) {
      logger.error(
        parseError(error),
        "Failed to clear form data from localStorage",
      );
    }
  };

  const hasStoredData = () => {
    const stored = loadFromStorage(isPersistenceActive, fullStorageKey);
    return stored !== null;
  };

  const restoreFormData = () => {
    if (hasRestoredRef.current) {
      return false;
    }

    const stored = loadFromStorage(isPersistenceActive, fullStorageKey);
    if (stored != null) {
      for (const [key, value] of typedEntries(stored.values)) {
        form.setValue(key as unknown as Path<ResourceFormValues<T>>, value, {
          shouldDirty: true,
          shouldValidate: false,
        });
      }
      hasRestoredRef.current = true;
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!isPersistenceActive) {
      return;
    }
    const subscription = form.watch((values) => {
      if (isFormStateDirty(form.formState)) {
        debouncedSave(
          values,
          debounceTimerRef,
          debounceMs,
          enabled,
          fullStorageKey,
          excludedFields,
        );
      }
    });

    const timerId = debounceTimerRef.current;
    return () => {
      subscription.unsubscribe();
      if (timerId != null) {
        clearTimeout(timerId);
      }
    };
  }, [
    form,
    isPersistenceActive,
    debounceMs,
    fullStorageKey,
    excludedFields,
    enabled,
  ]);

  return {
    clearLocalStorageData,
    restoreFormData,
    hasStoredData,
  };
}
