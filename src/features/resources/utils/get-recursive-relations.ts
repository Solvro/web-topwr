import { typedKeys } from "@/utils";

import type { Resource } from "../enums";
import { getResourceMetadata } from "./get-resource-metadata";
import { getResourceRelationDefinitions } from "./get-resource-relation-definitions";

const serializeRelation = (relation: string[]) => relation.join(".");

/**
 * Recursively gets an array of all recursive relations possible, delimited by periods.
 * Tracks previous relations to avoid infinite recursion.
 * For use with fetching relations via query parameters.
 */
export const getRecursiveRelations = (
  resource: Resource,
  prefix: string[] = [],
  visited: Set<Resource> = new Set(),
): string[] => {
  if (visited.has(resource)) {
    return [];
  }
  const newVisited = new Set(visited).add(resource);

  return typedKeys(getResourceRelationDefinitions(resource)).flatMap(
    (relation) => {
      const relationQueryName = getResourceMetadata(relation).queryName;
      if (relationQueryName == null) {
        return [];
      }
      const newPrefix = [...prefix, relationQueryName];
      return [
        serializeRelation(newPrefix),
        ...getRecursiveRelations(relation, newPrefix, newVisited),
      ];
    },
  );
};
