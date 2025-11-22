"use client";

import { createContext } from "react";

import type { Resource } from "@/features/resources";

import type { ArfSheetContextType } from "../types/internal";

/**
 * Do not use this context directly.
 * @see {@link useArfSheet} for accessing the sheet state.
 * @see {@link ArfSheetProvider} for providing the state to children.
 */
export const ArfSheetContext =
  createContext<ArfSheetContextType<Resource> | null>(null);
