import { createContext } from "react";

import type { Resource } from "@/config/enums";

import type { ArfSheetContextType } from "../types/internal";

/**
 * Do not use this context directly.
 * @see ..hooks#use-arf-sheet for accessing the sheet state.
 * @see ..providers#arf-sheet-provider for providing the state to children.
 */
export const ArfSheetContext =
  createContext<ArfSheetContextType<Resource> | null>(null);
