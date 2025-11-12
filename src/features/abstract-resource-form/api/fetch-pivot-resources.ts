import type { Resource } from "@/config/enums";
import { fetchResources, typedFromEntries } from "@/lib/helpers";
import type {
  RelationDefinition,
  RelationDefinitions,
  ResourceDataType,
  ResourcePivotRelation,
  ResourcePivotRelationData,
  ResourceRelation,
} from "@/types/app";

import { isPivotRelationDefinition } from "../utils/is-pivot-relation-definition";
import { isRelationPivotDefinition } from "../utils/is-relation-pivot-definition";

export const fetchPivotResources = async <T extends Resource>(
  relationInputs: RelationDefinitions<T> | undefined,
): Promise<ResourcePivotRelationData<T>> => {
  if (relationInputs == null) {
    return {} as ResourcePivotRelationData<T>;
  }
  const responses = await Promise.all(
    Object.values(relationInputs).map(async (relationDefinition) => {
      const definition = relationDefinition as RelationDefinition<
        T,
        ResourceRelation<T>
      >;
      if (
        !isPivotRelationDefinition(definition) ||
        !isRelationPivotDefinition(definition.pivotData)
      ) {
        return [];
      }
      const resource = definition.pivotData
        .relatedResource as ResourcePivotRelation<T>;
      const data = await fetchResources(resource);
      return [
        [resource, data] satisfies [
          typeof resource,
          ResourceDataType<typeof resource>[],
        ],
      ];
    }),
  );
  const entries = responses.flat();
  return typedFromEntries<ResourcePivotRelationData<T>>(entries);
};
