import type { Route } from "next";
import type { LinkProps } from "next/link";
import { createContext, useContext } from "react";

export interface UnsavedChangesContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  showConfirmDialog: (target: LinkProps<Route>["href"]) => void;
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
