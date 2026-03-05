import type { RefObject } from "react";
import type { Path, UseFormReturn } from "react-hook-form";

import type { Resource } from "@/features/resources";
import type { ResourceFormValues } from "@/features/resources/types";
import { typedEntries } from "@/utils";

import { loadFromStorage } from "./load-from-starage";

export function restoreFormData<T extends Resource>(
  hasRestoredRef: RefObject<boolean>,
  enabled: boolean,
  fullStorageKey: string,
  form: UseFormReturn<ResourceFormValues<T>>,
): boolean {
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
}
