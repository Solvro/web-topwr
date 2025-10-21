"use client";

import { createContext, useContext } from "react";

import type { Resource } from "@/config/enums";
import type { Id, ResourceRelation } from "@/types/app";

export interface RelationContext<T extends Resource> {
  parentResource: T;
  parentResourceId: Id;
  childResource: ResourceRelation<T>;
  closeSheet: () => void;
}

type NullableRelationContext = null | RelationContext<Resource>;

interface ArfContextType {
  relationContext: NullableRelationContext;
}

export const ArfContext = createContext<ArfContextType | null>(null);

export function useArfContext(): ArfContextType {
  const context = useContext(ArfContext);
  return context ?? { relationContext: null };
}
