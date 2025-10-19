import type { Resource } from "@/config/enums";
import { RESOURCE_METADATA } from "@/config/resources";
import type {
  Id,
  RelationDefinition,
  ResourceMetadata,
  ResourceRelation,
} from "@/types/app";

import { sanitizeId } from "./transformations";

export const TANSTACK_KEYS = {
  query: {
    resourceList: (resource: Resource) => `${resource}-list-page`,
  },
  mutation: {
    deleteResource: (resource: Resource, id: Id) =>
      `delete__${resource}__${sanitizeId(id)}`,
  },
};

/**
 * This helper function helps to retrieve metadata for a specific resource,
 * while typing it as a generic `ResourceMetadata<R>`, instead of the specific
 * metadata related to the given resource.
 */
export const getResourceMetadata = <R extends Resource>(resource: R) =>
  RESOURCE_METADATA[resource] as unknown as ResourceMetadata<R>;

/**
 * This helper function retrieves the relation definitions for a given resource,
 * typed as `Record<ResourceRelation<R>, RelationDefinition<R>>`.
 */
export const getResourceRelationDefinitions = <R extends Resource>(
  resource: R,
) =>
  (getResourceMetadata(resource).form.inputs.relationInputs ?? {}) as Record<
    ResourceRelation<R>,
    RelationDefinition<R>
  >;
