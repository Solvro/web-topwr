import type { Resource } from "@/config/enums";
import { RESOURCE_METADATA } from "@/config/resources";
import type {
  Id,
  RelationConfiguration,
  ResourceMetadata,
  ResourceRelation,
} from "@/types/app";

import { sanitizeId } from "./transformations";
import { typedKeys } from "./typescript";

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

export function getResourceRelationConfigurations<T extends Resource>(
  resource: T,
) {
  const metadata = RESOURCE_METADATA[resource];
  return (
    "relationInputs" in metadata.form.inputs
      ? metadata.form.inputs.relationInputs
      : {}
  ) as Record<ResourceRelation<T>, RelationConfiguration<ResourceRelation<T>>>;
}

export const getResourceRelations = <T extends Resource>(
  resource: T,
): ResourceRelation<T>[] =>
  typedKeys(getResourceRelationConfigurations(resource));
