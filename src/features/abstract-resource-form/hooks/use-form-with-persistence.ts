"use client";

import { useEffect } from "react";

import type { Resource } from "@/features/resources";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

import type { FormPersistenceOptions } from "../types/internal";
import { useFormPersistence } from "./use-form-persistence";

/**
 * Hook that combines unsaved changes detection with automatic form persistence.
 * Handles:
 * - Detecting unsaved changes for navigation prevention
 * - Automatically saving form data to localStorage when not editing
 * - Prompting user to restore data when revisiting the form
 * - Clearing saved data on successful submission
 */
export function useFormWithPersistence<T extends Resource>({
  storageKey,
  form,
  enabled = true,
  debounceMs = 1000,
  excludedFields,
  autoPromptRestore = true,
  onUnsavedChangesChange,
  isEditing = false,
}: FormPersistenceOptions<T>) {
  const { setHasUnsavedChanges } = useUnsavedChanges();

  const { clearLocalStorageData, restoreFormData, hasStoredData } =
    useFormPersistence({
      storageKey,
      form,
      enabled: enabled && !isEditing,
      debounceMs,
      excludedFields,
    });

  useEffect(() => {
    if (isEditing) {
      if (hasStoredData()) {
        clearLocalStorageData();
      }
      form.reset();
    } else if (enabled && autoPromptRestore && hasStoredData()) {
      restoreFormData();
    }
    const subscription = form.watch(() => {
      const hasChanges = form.formState.isDirty;

      setHasUnsavedChanges(hasChanges);
      onUnsavedChangesChange?.(hasChanges);
    });

    return () => {
      subscription.unsubscribe();
      setHasUnsavedChanges(false);
      onUnsavedChangesChange?.(false);
    };
  }, [form, isEditing, enabled]);

  const clearPersistedData = () => {
    clearLocalStorageData();
    setHasUnsavedChanges(false);
    onUnsavedChangesChange?.(false);
  };

  const resetForm = () => {
    if (isEditing) {
      form.reset();
      setHasUnsavedChanges(false);
      onUnsavedChangesChange?.(false);
    }
  };

  return {
    clearPersistedData,
    hasStoredData,
    resetForm,
  };
}
