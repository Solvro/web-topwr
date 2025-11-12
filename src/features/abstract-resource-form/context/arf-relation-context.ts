import { createContext } from "react";

import type { Resource } from "@/config/enums";

import type { ArfRelationContextType } from "../types/internal";

/**
 * Do not use this context directly.
 * @see {@link useArfRelation} for accessing the relation context.
 * @see {@link ArfSheetProvider} for (indirectly) providing the state to children.
 * @TODO consider merging this context with ArfSheetContext.
 */
export const ArfRelationContext =
  createContext<ArfRelationContextType<Resource> | null>(null);
