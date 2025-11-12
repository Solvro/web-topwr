"use client";

import { useContext } from "react";

import type { Resource } from "@/features/resources";

import { ArfRelationContext } from "../context/arf-relation-context";
import type { ArfRelationContextType } from "../types/internal";

/**
 * This hook is used for passing relation context information when the ARF is for editing/creating
 * a related resource (e.g. creating a link for a student organization).
 */
export function useArfRelation(): ArfRelationContextType<Resource> | null {
  const context = useContext(ArfRelationContext);
  return context;
}
