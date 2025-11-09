import type { z } from "zod";

import { DeclensionCase, RelationType } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { RESOURCE_METADATA } from "@/config/resource-metadata";
import { declineNoun } from "@/lib/polish";
import type {
  Id,
  OrderableResource,
  RelationDefinition,
  RelationQueryName,
  ResourceDataType,
  ResourceMetadata,
  ResourceRelation,
  XToManyResource,
} from "@/types/app";
import type {
  ResourceLabelOptions,
  ResourceRelations,
} from "@/types/components";
import type { ResourceSchemaKey } from "@/types/forms";

import { fetchQuery } from "../fetch-utils";
import { sanitizeId } from "./transformations";
import { typedEntries, typedFromEntries, typedKeys } from "./typescript";

/** Generates the key for Tanstack query or mutation operations. */
export const getKey = {
  query: {
    resourceList: (resource: Resource) => `${resource}-list-page`,
    pivotData: (resource: Resource) => `${resource}-pivot-data`,
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

const serializeRelation = (relation: string[]) => relation.join(".");

/**
 * Recursively gets an array of all recursive relations possible, delimited by periods.
 * For use with fetching relations via query parameters.
 */
export const getRecursiveRelations = (
  resource: Resource,
  prefix: string[] = [],
): string[] =>
  typedKeys(getResourceRelationDefinitions(resource)).flatMap((relation) => {
    const relationQueryName = getResourceMetadata(relation).queryName;
    if (relationQueryName == null) {
      return [];
    }
    const newPrefix = [...prefix, relationQueryName];
    return [
      serializeRelation(newPrefix),
      ...getRecursiveRelations(relation, newPrefix),
    ];
  });

/**
 * Declines the resource name correctly and uses its first word only.
 * Used to ensure the label isn't too long.
 *
 * @example getManagingResourceLabel(Resource.StudentOrganizations) === 'Zarządzanie organizacjami'
 */
export function getManagingResourceLabel(
  resource: Resource,
  { firstWordOnly = true, plural = true }: ResourceLabelOptions = {},
): string {
  const declined = declineNoun(resource, {
    case: DeclensionCase.Instrumental,
    plural,
  });
  const firstWord = firstWordOnly ? declined.split(" ")[0] : declined;
  return `Zarządzanie ${firstWord}`;
}

type LabelledRelationData<T extends ResourceRelation<Resource>> = [
  T,
  ResourceDataType<T>[],
];

export async function fetchRelatedResources<T extends Resource>(
  resource: T,
): Promise<ResourceRelations<T>> {
  const responses = await Promise.all(
    typedEntries(getResourceRelationDefinitions(resource)).map(
      async ([relation, relationDefinition]) =>
        relationDefinition.type === RelationType.OneToMany
          ? []
          : [
              [
                relation,
                await fetchQuery<{ data: ResourceDataType<typeof relation>[] }>(
                  "",
                  { resource: relation, includeRelations: true },
                ).then(({ data }) => data),
              ] as LabelledRelationData<ResourceRelation<T>>,
            ],
    ),
  );
  return typedFromEntries<ResourceRelations<T>>(responses.flat());
}

export const isManyToOneRelationDefinition = <T extends Resource>(
  definition: unknown,
): definition is {
  type: RelationType.ManyToOne;
  foreignKey: ResourceSchemaKey<T, z.ZodString | z.ZodNumber>;
} => {
  return (
    typeof definition === "object" &&
    definition !== null &&
    "type" in definition &&
    definition.type === RelationType.ManyToOne
  );
};

export const isManyToManyRelationDefinition = (
  definition: unknown,
): definition is { type: RelationType.ManyToMany } => {
  return (
    typeof definition === "object" &&
    definition !== null &&
    "type" in definition &&
    definition.type === RelationType.ManyToMany
  );
};
