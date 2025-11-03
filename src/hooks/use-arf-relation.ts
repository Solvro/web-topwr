"use client";

import { createContext, useContext } from "react";

import type { Resource } from "@/config/enums";
import type { Id, ResourceRelation } from "@/types/app";

export interface ArfRelationContextType<T extends Resource> {
  parentResource: T;
  parentResourceId: Id;
  childResource: ResourceRelation<T>;
  closeSheet: () => void;
}

export const ArfRelationContext =
  createContext<ArfRelationContextType<Resource> | null>(null);

/**
 * This hook is used for passing relation context information when the ARF is for editing/creating
 * a related resource (e.g. creating a link for a student organization).
 */
export function useArfRelation(): ArfRelationContextType<Resource> | null {
  const context = useContext(ArfRelationContext);
  return context;
}
