import type { ResourceBadgeDefinitions } from "@/features/abstract-resource-list";

import { RESOURCE_BADGE_DEFINITIONS } from "../data/badge-definitions";
import type { Resource } from "../enums";

export const getResourceBadgeDefinitions = <R extends Resource>(
  resource: R,
): ResourceBadgeDefinitions<R> | undefined =>
  (
    RESOURCE_BADGE_DEFINITIONS as unknown as Record<
      Resource,
      ResourceBadgeDefinitions<R> | undefined
    >
  )[resource];
