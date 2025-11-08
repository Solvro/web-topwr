import type { Route } from "next";
import { createContext, useContext } from "react";

export interface UnsavedChangesContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  showConfirmDialog: <T extends string>(target: Route<T>) => void;
}

export const UnsavedChangesContext =
  createContext<UnsavedChangesContextType | null>(null);

export function useUnsavedChanges(): UnsavedChangesContextType {
  const context = useContext(UnsavedChangesContext);
  if (context == null) {
    throw new Error(
      "useUnsavedChanges must be used within an UnsavedChangesProvider",
    );
  }
  return context;
}
