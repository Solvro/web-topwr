"use client";

import { useEffect, useRef } from "react";
import type { Path } from "react-hook-form";

import { logger, parseError } from "@/features/logging";
import type { Resource } from "@/features/resources";
import type { ResourceFormValues } from "@/features/resources/types";
import { typedEntries } from "@/utils";

import type {
  FormPersistenceOptions,
  PersistedFormData,
} from "../types/internal";

const STORAGE_PREFIX = "topwr_form_";

/**
 * Hook that automatically persists form data to localStorage and restores it on component mount.
 */
export function useFormPersistence<T extends Resource>({
  storageKey,
  form,
  enabled = true,
  debounceMs = 1000,
  excludeFields = [],
}: FormPersistenceOptions<T>) {
  const fullStorageKey = `${STORAGE_PREFIX}${storageKey}`;
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const hasRestoredRef = useRef(false);

  const filterValues = (values: ResourceFormValues<T>) =>
    Object.fromEntries(
      Object.entries(values).filter(([key]) => !excludeFields.includes(key)),
    );

  const saveToStorage = (values: ResourceFormValues<T>) => {
    if (!enabled) {
      return;
    }

    try {
      const filteredValues = filterValues(values) as ResourceFormValues<T>;
      const persistedData: PersistedFormData<T> = {
        values: filteredValues,
        timestamp: Date.now(),
      };
      localStorage.setItem(fullStorageKey, JSON.stringify(persistedData));
    } catch (error) {
      logger.error(
        parseError(error),
        "Failed to save form data to localStorage",
      );
    }
  };

  const loadFromStorage = (): PersistedFormData<T> | null => {
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
  };

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
    const stored = loadFromStorage();
    return stored !== null;
  };

  const restoreFormData = () => {
    if (hasRestoredRef.current) {
      return false;
    }

    const stored = loadFromStorage();
    if (stored != null) {
      for (const [key, value] of typedEntries(stored.values)) {
        form.setValue(
          key as unknown as Path<ResourceFormValues<T>>,
          value as never,
          {
            shouldDirty: true,
            shouldValidate: false,
          },
        );
      }
      hasRestoredRef.current = true;
      return true;
    }
    return false;
  };

  const debouncedSave = (values: ResourceFormValues<T>) => {
    if (debounceTimerRef.current != null) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      saveToStorage(values);
    }, debounceMs);
  };

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const subscription = form.watch((values) => {
      if (form.formState.isDirty) {
        debouncedSave(values as ResourceFormValues<T>);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (debounceTimerRef.current != null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [form, enabled, debounceMs, debouncedSave]);

  return {
    saveToStorage: () => {
      saveToStorage(form.getValues());
    },
    clearStoredData,
    restoreFormData,
    hasStoredData,
  };
}
