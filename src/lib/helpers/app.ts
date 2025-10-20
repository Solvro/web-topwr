import type { z } from "zod";

import type { Resource } from "@/config/enums";
import { RESOURCE_METADATA } from "@/config/resources";
import type {
  Id,
  OrderableResource,
  RelationDefinition,
  RelationQueryName,
  ResourceMetadata,
  ResourceRelation,
  XToManyResource,
} from "@/types/app";
import type { ResourceSchemaKey } from "@/types/forms";

import { sanitizeId } from "./transformations";

/** Generates the key for Tanstack query or mutation operations. */
export const getKey = {
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
  (getResourceMetadata(resource).form.inputs.relationInputs ?? {}) as {
    [L in ResourceRelation<R>]: RelationDefinition<R, L>;
  };

/**
 * Returns the query name for a many-to-many resource, typed as definite.
 */
export const getResourceQueryName = <R extends XToManyResource>(resource: R) =>
  getResourceMetadata(resource).queryName as RelationQueryName<R>;

/** Gets the field value of the resource's primary key (usually literal `"id"`). */
export const getResourcePk = <T extends Resource>(
  resource: T,
): ResourceSchemaKey<T, z.ZodString | z.ZodNumber> => {
  const metadata = getResourceMetadata(resource);
  return (
    metadata.pk ?? ("id" as ResourceSchemaKey<T, z.ZodString | z.ZodNumber>)
  );
};

export const isOrderableResource = (
  resource: Resource,
): resource is OrderableResource =>
  getResourceMetadata(resource).orderable === true;
