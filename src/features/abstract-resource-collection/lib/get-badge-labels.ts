import type { ZodNumber, ZodString } from "zod";

import { logger } from "@/features/logging";
import {
  RelationType,
  getFieldValue,
  getResourceMetadata,
  getResourceRelationDefinitions,
} from "@/features/resources";
import type { Resource } from "@/features/resources";
import type {
  EditableResource,
  RelationDefinition,
  ResourceDataType,
  ResourceRelation,
  ResourceSchemaKey,
} from "@/features/resources/types";
import type { ResourceRelations } from "@/types/components";
import { typedEntries } from "@/utils";

import type { ListItem } from "../types";

function getManyToOneRelationBadge<T extends EditableResource>(
  item: ResourceDataType<T>,
  relationDefinition: RelationDefinition<T, Resource>,
  relationResource: ResourceRelation<T>,
  relatedResources: ResourceRelations<T>,
  badgeResourceDisplayField: ResourceSchemaKey<Resource, ZodString | ZodNumber>,
) {
  if (relationDefinition.foreignKey == null) {
    return null;
  }

  const foreignKeyValue = getFieldValue(
    item,
    relationDefinition.foreignKey as ResourceSchemaKey<
      T,
      ZodString | ZodNumber
    >,
  );

  for (const relatedResource of relatedResources[relationResource]) {
    if (relatedResource.id === foreignKeyValue) {
      const labelValue = getFieldValue(
        relatedResource,
        badgeResourceDisplayField,
      );
      if (typeof labelValue === "string") {
        return labelValue;
      }
    }
  }
  return null;
}

function getManyToManyRelationBadge<T extends EditableResource>(
  item: ResourceDataType<T>,
  badgeResource: Resource,
  badgeResourceDisplayField: ResourceSchemaKey<Resource, ZodString | ZodNumber>,
): string[] {
  const retrievedBadges: string[] = [];
  const queryName = getResourceMetadata(badgeResource).queryName;
  const relationItems = getFieldValue(
    item,
    queryName as ResourceSchemaKey<T, ZodString>,
  );

  if (Array.isArray(relationItems)) {
    for (const relationItem of relationItems) {
      const labelValue = getFieldValue(
        relationItem as ResourceDataType<Resource>,
        badgeResourceDisplayField,
      );
      if (typeof labelValue === "string") {
        retrievedBadges.push(labelValue);
      }
    }
  }
  return retrievedBadges;
}

export function getBadgeLabels<T extends EditableResource>(
  item: ResourceDataType<T>,
  listItem: ListItem<T>,
  resource: T,
  relatedResources: ResourceRelations<T>,
): string[] {
  if (listItem.badges == null) {
    return [];
  }

  const labels: string[] = [];
  const relationDefinitions = getResourceRelationDefinitions(resource);

  for (const [badgeResource, badgeResourceDisplayField] of typedEntries(
    listItem.badges,
  )) {
    const [relationResource, relationDefinition] =
      typedEntries(relationDefinitions).find(
        ([relationName]) => relationName === badgeResource,
      ) ?? [];

    if (
      relationResource == null ||
      relationDefinition == null ||
      badgeResourceDisplayField == null
    ) {
      logger.warn(
        { relationResource, relationDefinition, badgeResourceDisplayField },
        "Skipping badge retrieval due to null relation or field",
      );
      continue;
    }

    switch (relationDefinition.type) {
      case RelationType.ManyToOne: {
        const newLabelValue = getManyToOneRelationBadge(
          item,
          relationDefinition,
          relationResource,
          relatedResources,
          badgeResourceDisplayField,
        );
        if (newLabelValue != null && !labels.includes(newLabelValue)) {
          labels.push(newLabelValue);
        }
        break;
      }
      case RelationType.ManyToMany: {
        const newLabelValues = getManyToManyRelationBadge(
          item,
          badgeResource,
          badgeResourceDisplayField,
        );
        for (const label of newLabelValues) {
          if (!labels.includes(label)) {
            labels.push(label);
          }
        }
        break;
      }
      case RelationType.OneToMany: {
        logger.warn("Badges for one to many relations are not implemented yet");
        break;
      }
      default: {
        break;
      }
    }
  }
  return labels;
}
