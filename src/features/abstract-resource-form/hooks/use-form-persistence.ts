"use client";

import { useEffect, useRef } from "react";
import type { Path } from "react-hook-form";

import { logger, parseError } from "@/features/logging";
import type { Resource } from "@/features/resources";
import type { ResourceFormValues } from "@/features/resources/types";
import { typedEntries } from "@/utils";

import type { FormPersistenceOptions } from "../types/internal";
import { debouncedSave } from "../utils/debounced-save";
import { loadFromStorage } from "../utils/load-from-starage";

const STORAGE_PREFIX = "topwr_form_";

/**
 * Hook that automatically persists form data to localStorage and restores it on component mount.
 */
export function useFormPersistence<T extends Resource>({
  storageKey,
  form,
  enabled = true,
  debounceMs = 1000,
  excludedFields,
}: FormPersistenceOptions<T>) {
  const fullStorageKey = `${STORAGE_PREFIX}${storageKey}`;
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const hasRestoredRef = useRef(false);

  const clearStoredData = () => {
    try {
      localStorage.removeItem(fullStorageKey);
    } catch (error) {
      logger.error(
        parseError(error),
        "Failed to clear form data from localStorage",
      );
    }
  };

  const hasStoredData = () => {
    const stored = loadFromStorage(enabled, fullStorageKey);
    return stored !== null;
  };

  const restoreFormData = () => {
    if (hasRestoredRef.current) {
      return false;
    }

    const stored = loadFromStorage(enabled, fullStorageKey);
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
    if (!enabled) {
      return;
    }
    const subscription = form.watch((values) => {
      if (form.formState.isDirty) {
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
  }, [form, enabled, debounceMs, fullStorageKey, excludedFields]);

  return {
    clearStoredData,
    restoreFormData,
    hasStoredData,
  };
}
