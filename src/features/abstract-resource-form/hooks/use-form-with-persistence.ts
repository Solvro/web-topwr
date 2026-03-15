"use client";

import { useEffect } from "react";

import type { Resource } from "@/features/resources";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

import type { FormPersistenceOptions } from "../types/internal";
import { isFormStateDirty } from "../utils/is-form-state-dirty";
import { useFormPersistence } from "./use-form-persistence";

/**
 * Hook that combines unsaved changes detection with automatic form persistence.
 * Handles:
 * - Detecting unsaved changes for navigation prevention when editing
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
  isEditing = false,
}: FormPersistenceOptions<T>) {
  const { setHasUnsavedChanges } = useUnsavedChanges();

  const { clearLocalStorageData, restoreFormData, hasStoredData } =
    useFormPersistence({
      storageKey,
      form,
      enabled,
      debounceMs,
      excludedFields,
      isEditing,
    });

  // Handle initialization and data restoration
  useEffect(() => {
    if (isEditing) {
      if (hasStoredData()) {
        clearLocalStorageData();
      }
      form.reset();
    } else if (enabled && autoPromptRestore && hasStoredData()) {
      restoreFormData();
    }
  }, [
    isEditing,
    enabled,
    autoPromptRestore,
    form,
    hasStoredData,
    clearLocalStorageData,
    restoreFormData,
  ]);

  // Handle form changes detection
  useEffect(() => {
    const subscription = form.watch(() => {
      const hasChanges = isFormStateDirty(form.formState);

      setHasUnsavedChanges(isEditing && hasChanges);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [form, isEditing, setHasUnsavedChanges]);

  // Cleanup hasUnsavedChanges on unmount or when switching modes
  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

  const clearPersistedData = () => {
    clearLocalStorageData();
    setHasUnsavedChanges(false);
  };

  const resetForm = () => {
    if (isEditing) {
      form.reset();
      setHasUnsavedChanges(false);
    }
  };

  return {
    clearPersistedData,
    hasStoredData,
    resetForm,
  };
}
