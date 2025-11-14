import { RESOURCE_METADATA } from "../data/resource-metadata";
import type { Resource } from "../enums";
import type { ResourceMetadata } from "../types/internal";

/**
 * This helper function helps to retrieve metadata for a specific resource,
 * while typing it as a generic `ResourceMetadata<R>`, instead of the specific
 * metadata related to the given resource.
 */
export const getResourceMetadata = <R extends Resource>(resource: R) =>
  RESOURCE_METADATA[resource] as unknown as ResourceMetadata<R>;
