import type Link from "next/link";
import { createContext, useContext } from "react";
import type { ComponentProps } from "react";

export interface UnsavedChangesContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  showConfirmDialog: (target: ComponentProps<typeof Link>["href"]) => void;
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
