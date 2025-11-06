import {
  getResourceMetadata,
  getResourceRelationDefinitions,
} from "@/features/resources";
import type {
  EditableResource,
  ResourceDataType,
} from "@/features/resources/types";
import type { ResourceRelations } from "@/types/components";
import { typedEntries, typedKeys } from "@/utils";

import type { ListItem } from "../types";
import { isManyToManyRelationDefinition } from "./is-many-to-many-relation-definition";
import { isManyToOneRelationDefinition } from "./is-many-to-one-relation-definition";

export function getBadgeLabels<T extends EditableResource>(
  item: ResourceDataType<T>,
  listItem: ListItem,
  resource: T,
  relatedResources: ResourceRelations<T>,
) {
  const labels: string[] = [];
  const relationDefinitions = getResourceRelationDefinitions(resource);

  if (listItem.badges == null) {
    return labels;
  }

  for (const badgeResource of typedKeys(listItem.badges)) {
    const matchingRelation = typedEntries(relationDefinitions).find(
      ([relationName]) => relationName === badgeResource,
    );
    if (matchingRelation == null) {
      continue;
    }
    const [relationName, relation] = matchingRelation;

    if (isManyToOneRelationDefinition(relation)) {
      const foreignKey = relation.foreignKey as keyof typeof item;
      const foreignKeyValue = item[foreignKey];
      if (foreignKeyValue == null) {
        continue;
      }
      for (const relatedResource of relatedResources[relationName]) {
        if (relatedResource.id === foreignKeyValue) {
          labels.push(
            (relatedResource as unknown as Record<PropertyKey, unknown>)[
              listItem.badges[badgeResource] as PropertyKey
            ] as string,
          );
        }
      }
    } else if (isManyToManyRelationDefinition(relation)) {
      const relationItems =
        item[getResourceMetadata(badgeResource).queryName as keyof typeof item];
      for (const relationItem of [relationItems].flat()) {
        labels.push(
          (relationItem as Record<PropertyKey, unknown>)[
            listItem.badges[badgeResource] as PropertyKey
          ] as string,
        );
      }
    }
  }
  return labels;
}
