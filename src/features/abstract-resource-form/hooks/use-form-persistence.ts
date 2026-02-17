"use client";

import { useCallback, useEffect, useRef } from "react";

import type { Resource } from "@/features/resources";
import type { ResourceFormValues } from "@/features/resources/types";

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

  const filterValues = useCallback(
    (values: ResourceFormValues<T>) => {
      return Object.fromEntries(
        Object.entries(values).filter(([key]) => !excludeFields.includes(key)),
      );
    },
    [excludeFields],
  );

  const saveToStorage = useCallback(
    (values: ResourceFormValues<T>) => {
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
        console.warn("Failed to save form data to localStorage:", error);
      }
    },
    [enabled, filterValues, fullStorageKey],
  );

  const loadFromStorage = useCallback((): PersistedFormData<T> | null => {
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
      console.warn("Failed to load form data from localStorage:", error);
      return null;
    }
  }, [enabled, fullStorageKey]);

  const clearStoredData = useCallback(() => {
    try {
      localStorage.removeItem(fullStorageKey);
    } catch (error) {
      console.warn("Failed to clear form data from localStorage:", error);
    }
  }, [fullStorageKey]);

  const hasStoredData = useCallback(() => {
    const stored = loadFromStorage();
    return stored !== null;
  }, [loadFromStorage]);

  const restoreFormData = useCallback(() => {
    if (hasRestoredRef.current) {
      return false;
    }

    const stored = loadFromStorage();
    if (stored != null) {
      form.reset(stored.values);
      hasRestoredRef.current = true;
      return true;
    }
    return false;
  }, [loadFromStorage, form]);

  const debouncedSave = useCallback(
    (values: ResourceFormValues<T>) => {
      if (debounceTimerRef.current != null) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        saveToStorage(values);
      }, debounceMs);
    },
    [saveToStorage, debounceMs],
  );

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
  }, [form, enabled, debouncedSave]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current != null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    saveToStorage: () => {
      saveToStorage(form.getValues());
    },
    clearStoredData,
    restoreFormData,
    hasStoredData,
  };
}
