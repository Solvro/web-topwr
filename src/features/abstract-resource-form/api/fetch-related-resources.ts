import {
  RelationType,
  getResourceArrayInputResources,
  getResourceRelationDefinitions,
} from "@/features/resources";
import type { Resource } from "@/features/resources";
import type { ArrayResources } from "@/features/resources/types";
import { fetchResources, typedEntries, typedFromEntries } from "@/lib/helpers";
import type { ResourceRelations } from "@/types/components";

import type { RelationDataTuple } from "../types/internal";

export async function fetchRelatedResources<T extends Resource>(
  resource: T,
): Promise<ResourceRelations<T>> {
  const arrayInputResources = typedEntries(
    getResourceArrayInputResources(resource),
  ).map(async ([_field, inputOptions]) => [
    [
      inputOptions.itemsResource as ArrayResources<T>,
      await fetchResources(inputOptions.itemsResource),
    ] as RelationDataTuple<T>,
  ]);
  const relationDefinitionResourcePromises = typedEntries(
    getResourceRelationDefinitions(resource),
  ).map(async ([relation, relationDefinition]) =>
    relationDefinition.type === RelationType.OneToMany
      ? []
      : [
          [
            relation,
            await fetchResources(relation, true),
          ] as RelationDataTuple<T>,
        ],
  );
  const responses = await Promise.all([
    ...arrayInputResources,
    ...relationDefinitionResourcePromises,
  ]);
  const labelledRelationData = responses.flat();
  return typedFromEntries<ResourceRelations<T>>(labelledRelationData);
}
