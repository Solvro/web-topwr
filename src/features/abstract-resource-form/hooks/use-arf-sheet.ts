import { useContext } from "react";

import type { Resource } from "@/config/enums";

import { ArfSheetContext } from "../context/arf-sheet-context";
import type { ArfSheetContextType } from "../types/internal";

/**
 * This hook is for accessing the `showSheet` function from within any `ArfSheetProvider` instances.
 * For example, the `ArfSheet` wraps its ARF instance in `ArfSheetProvider`, so the ARF can use this hook
 * in order to close the sheet on submission.
 * It can also be used to provide sheet state to other `ArfSheet` components, outside of the one baked into ARF itself.
 */
export const useArfSheet = <T extends Resource>(
  resource: T,
): ArfSheetContextType<T> => {
  const context = useContext(ArfSheetContext);

  if (context == null) {
    throw new Error("useArfSheet must be used within an ArfSheetProvider");
  }

  if (context.resource !== resource) {
    throw new Error(
      `useArfSheet resource mismatch: expected ${resource}, got ${context.resource}`,
    );
  }

  // the type is verified above, but TypeScript can't infer it
  // maybe this is due to a mistake with the ArfSheetContextType interface?
  return context as unknown as ArfSheetContextType<T>;
};
