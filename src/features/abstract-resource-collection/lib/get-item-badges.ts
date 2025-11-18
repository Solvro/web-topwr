import type { ZodNumber, ZodString } from "zod";

import { logger } from "@/features/logging";
import {
  RelationType,
  Resource,
  getFieldValue,
  getResourceMetadata,
  getResourceRelationDefinitions,
} from "@/features/resources";
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
import type { ItemBadge, ItemBadgeVariant } from "../types/internal";

function getManyToOneRelationBadge<T extends EditableResource>(
  item: ResourceDataType<T>,
  badgeResource: Resource,
  relationDefinition: RelationDefinition<T, Resource>,
  relationResource: ResourceRelation<T>,
  relatedResources: ResourceRelations<T>,
  displayField: ResourceSchemaKey<Resource, ZodString | ZodNumber>,
  variant: ItemBadgeVariant,
): ItemBadge | null {
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
      const labelValue = getFieldValue(relatedResource, displayField);

      if (typeof labelValue !== "string") {
        return null;
      }

      if (badgeResource === Resource.Departments) {
        const customColor1 = getFieldValue(
          relatedResource as ResourceDataType<Resource>,
          "gradientStart" as ResourceSchemaKey<Resource, ZodString>,
        );
        const customColor2 = getFieldValue(
          relatedResource as ResourceDataType<Resource>,
          "gradientStop" as ResourceSchemaKey<Resource, ZodString>,
        );
        return customColor1 && customColor2
          ? {
              displayField: labelValue,
              variant,
              customColors: { color1: customColor1, color2: customColor2 },
            }
          : { displayField: labelValue, variant };
      }

      return { displayField: labelValue, variant };
    }
  }
  return null;
}

function getManyToManyRelationBadge<T extends EditableResource>(
  item: ResourceDataType<T>,
  badgeResource: Resource,
  displayField: ResourceSchemaKey<Resource, ZodString | ZodNumber>,
  variant: ItemBadgeVariant,
): ItemBadge[] {
  const retrievedBadges: ItemBadge[] = [];
  const queryName = getResourceMetadata(badgeResource).queryName;
  const relationItems = getFieldValue(
    item,
    queryName as ResourceSchemaKey<T, ZodString>,
  );

  if (Array.isArray(relationItems)) {
    for (const relationItem of relationItems) {
      const labelValue = getFieldValue(
        relationItem as ResourceDataType<Resource>,
        displayField,
      );

      if (typeof labelValue === "string") {
        retrievedBadges.push({ displayField: labelValue, variant });
      }
    }
  }
  return retrievedBadges;
}

export function getItemBadges<T extends EditableResource>(
  item: ResourceDataType<T>,
  listItem: ListItem<T>,
  resource: T,
  relatedResources: ResourceRelations<T>,
): ItemBadge[] {
  if (listItem.badges == null) {
    return [];
  }

  const badges: ItemBadge[] = [];
  const relationDefinitions = getResourceRelationDefinitions(resource);

  for (const [badgeResource, badgeConfig] of typedEntries(listItem.badges)) {
    if (badgeConfig == null) {
      continue;
    }

    const [relationResource, relationDefinition] =
      typedEntries(relationDefinitions).find(
        ([relationName]) => relationName === badgeResource,
      ) ?? [];

    if (relationResource == null || relationDefinition == null) {
      logger.warn(
        { relationResource, relationDefinition },
        "Skipping badge retrieval due to null relation or field",
      );
      continue;
    }

    switch (relationDefinition.type) {
      case RelationType.ManyToOne: {
        const badge = getManyToOneRelationBadge(
          item,
          badgeResource,
          relationDefinition,
          relationResource,
          relatedResources,
          badgeConfig.displayField,
          badgeConfig.variant,
        );

        if (
          badge != null &&
          !badges.some((b) => b.displayField === badge.displayField)
        ) {
          badges.push(badge);
        }
        break;
      }
      case RelationType.ManyToMany: {
        const newBadges = getManyToManyRelationBadge(
          item,
          badgeResource,
          badgeConfig.displayField,
          badgeConfig.variant,
        );

        for (const badge of newBadges) {
          if (!badges.some((b) => b.displayField === badge.displayField)) {
            badges.push(badge);
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
  return badges;
}
