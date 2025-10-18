import type { Resource } from "@/config/enums";
import {
  RELATED_RESOURCE_METADATA,
  RESOURCE_METADATA,
} from "@/config/resources";
import type {
  Id,
  RelationConfiguration,
  ResourceMetadata,
  ResourceRelation,
} from "@/types/app";

import { sanitizeId } from "./transformations";
import { typedEntries, typedKeys } from "./typescript";

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

type RelationConfigurations<T extends Resource> = Record<
  ResourceRelation<T>,
  RelationConfiguration<ResourceRelation<T>>
>;

export function getResourceRelationConfigurations<T extends Resource>(
  resource: T,
) {
  const metadata = RESOURCE_METADATA[resource];
  return (
    "relationInputs" in metadata.form.inputs
      ? Object.fromEntries(
          typedEntries(metadata.form.inputs.relationInputs).map(
            ([relation]) => [relation, RELATED_RESOURCE_METADATA[relation]],
          ),
        )
      : {}
  ) as RelationConfigurations<T>;
}

export const getResourceRelations = <T extends Resource>(
  resource: T,
): ResourceRelation<T>[] =>
  typedKeys(getResourceRelationConfigurations(resource));
