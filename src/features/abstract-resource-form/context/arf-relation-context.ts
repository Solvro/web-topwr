import { createContext } from "react";

import type { Resource } from "@/config/enums";

import type { ArfRelationContextType } from "../types/internal";

/**
 * Do not use this context directly.
 * @see ..hooks#use-arf-relation for accessing the relation context.
 * @see ..providers#arf-sheet-provider for (indirectly) providing the state to children.
 * @TODO consider merging this context with ArfSheetContext.
 */
export const ArfRelationContext =
  createContext<ArfRelationContextType<Resource> | null>(null);
