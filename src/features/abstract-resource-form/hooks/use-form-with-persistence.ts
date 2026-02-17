"use client";

import { useCallback, useEffect } from "react";

import type { Resource } from "@/features/resources";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

import type { FormPersistenceOptions } from "../types/internal";
import { useFormPersistence } from "./use-form-persistence";

/**
 * Hook that combines unsaved changes detection with automatic form persistence.
 * Handles:
 * - Detecting unsaved changes for navigation prevention
 * - Automatically saving form data to localStorage (only for creation)
 * - Prompting user to restore data when revisiting the form
 * - Clearing saved data on successful submission
 */
export function useFormWithPersistence<T extends Resource>({
  storageKey,
  form,
  enabled = true,
  debounceMs = 1000,
  excludeFields = [],
  autoPromptRestore = true,
  onUnsavedChangesChange,
  isEditing = false,
}: FormPersistenceOptions<T>) {
  const { setHasUnsavedChanges } = useUnsavedChanges();

  const { clearStoredData, restoreFormData, hasStoredData } =
    useFormPersistence({
      storageKey,
      form,
      enabled: enabled && !isEditing,
      debounceMs,
      excludeFields,
    });

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const subscription = form.watch(() => {
      const isDirty = form.formState.isDirty;

      const defaultValues = form.control._defaultValues;
      const currentValues = form.getValues();

      const valuesChanged =
        JSON.stringify(currentValues) !== JSON.stringify(defaultValues);

      const hasChanges = isDirty || valuesChanged;
      setHasUnsavedChanges(hasChanges);
      onUnsavedChangesChange?.(hasChanges);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [form, isEditing, setHasUnsavedChanges, onUnsavedChangesChange]);

  useEffect(() => {
    if (!enabled || !autoPromptRestore || isEditing) {
      return;
    }
    const timeoutId = setTimeout(() => {
      if (hasStoredData()) {
        restoreFormData();
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [enabled, autoPromptRestore, isEditing, hasStoredData, restoreFormData]);

  const clearPersistedData = useCallback(() => {
    clearStoredData();
    setHasUnsavedChanges(false);
    onUnsavedChangesChange?.(false);
  }, [clearStoredData, setHasUnsavedChanges, onUnsavedChangesChange]);

  const resetForm = useCallback(() => {
    if (isEditing) {
      form.reset();
      setHasUnsavedChanges(false);
      onUnsavedChangesChange?.(false);
    }
  }, [form, isEditing, setHasUnsavedChanges, onUnsavedChangesChange]);

  return {
    clearPersistedData,
    hasStoredData,
    clearStoredData,
    resetForm,
  };
}
