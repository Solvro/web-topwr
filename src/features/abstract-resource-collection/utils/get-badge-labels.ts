import type { ZodNumber, ZodString } from "zod";

import {
  getFieldValue,
  getResourceMetadata,
  getResourceRelationDefinitions,
} from "@/features/resources";
import type {
  EditableResource,
  ResourceDataType,
  ResourceRelation,
  ResourceSchemaKey,
} from "@/features/resources/types";
import type { ResourceRelations } from "@/types/components";
import { typedEntries } from "@/utils";

import type { ListItem } from "../types";
import { isManyToManyRelationDefinition } from "./is-many-to-many-relation-definition";
import { isManyToOneRelationDefinition } from "./is-many-to-one-relation-definition";

export function getBadgeLabels<T extends EditableResource>(
  item: ResourceDataType<T>,
  listItem: ListItem,
  resource: T,
  relatedResources: ResourceRelations<T>,
): string[] {
  if (listItem.badges == null) {
    return [];
  }

  const labels: string[] = [];
  const relationDefinitions = getResourceRelationDefinitions(resource);

  for (const badge of typedEntries(listItem.badges)) {
    const [badgeResource, badgeValue] = badge;
    const typedBadgeValue = badgeValue as ResourceSchemaKey<
      ResourceRelation<T>,
      ZodString | ZodNumber
    >;

    const matchingRelation = typedEntries(relationDefinitions).find(
      ([relationName]) => relationName === badgeResource,
    );
    if (matchingRelation == null || badgeValue == null) {
      continue;
    }
    const [relationName, relation] = matchingRelation;

    if (isManyToOneRelationDefinition(relation)) {
      const foreignKeyValue = getFieldValue(item, relation.foreignKey);

      for (const relatedResource of relatedResources[relationName]) {
        if (relatedResource.id === foreignKeyValue) {
          const labelValue = getFieldValue(relatedResource, typedBadgeValue);
          if (typeof labelValue === "string" && !(labelValue in labels)) {
            labels.push(labelValue);
          }
          break;
        }
      }
    } else if (isManyToManyRelationDefinition(relation)) {
      const queryName = getResourceMetadata(badgeResource).queryName;
      const relationItems = getFieldValue(
        item,
        queryName as ResourceSchemaKey<T, ZodString>,
      );

      if (Array.isArray(relationItems)) {
        for (const relationItem of relationItems) {
          const labelValue = getFieldValue(
            relationItem as ResourceDataType<ResourceRelation<T>>,
            typedBadgeValue,
          );
          if (typeof labelValue === "string" && !(labelValue in labels)) {
            labels.push(labelValue);
          }
        }
      }
    }
  }
  return labels;
}
