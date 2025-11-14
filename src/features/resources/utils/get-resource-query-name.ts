import type { RelationQueryName, XToManyResource } from "../types/relations";
import { getResourceMetadata } from "./get-resource-metadata";

/**
 * Returns the query name for a many-to-many resource, typed as definite.
 */
export const getResourceQueryName = <R extends XToManyResource>(resource: R) =>
  getResourceMetadata(resource).queryName as RelationQueryName<R>;
