import type { ZodNumber, ZodString } from "zod";

import { logger } from "@/features/logging";
import type { Resource } from "@/features/resources";
import {
  RelationType,
  getFieldValue,
  getResourceMetadata,
  getResourceRelationDefinitions,
} from "@/features/resources";
import type {
  RelationDefinition,
  ResourceDataType,
  ResourceRelation,
  ResourceSchemaKey,
} from "@/features/resources/types";
import type { ResourceRelations } from "@/types/components";
import { typedEntries } from "@/utils";

import type { ListItem } from "../types";
import type { BadgeConfig, ItemBadge } from "../types/internal";

function getManyToOneRelationBadge<
  T extends Resource,
  R extends ResourceRelation<T>,
>(
  item: ResourceDataType<T>,
  relationResource: R,
  relationDefinition: RelationDefinition<T, R>,
  relatedResources: ResourceRelations<T>,
  badgeConfig: BadgeConfig<R>,
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
      const labelValue = getFieldValue(
        relatedResource,
        badgeConfig.displayField,
      );

      if (typeof labelValue !== "string") {
        return null;
      }

      if (badgeConfig.colorField != null) {
        const colorFieldValue = getFieldValue(
          relatedResource,
          badgeConfig.colorField,
        );
        if (typeof colorFieldValue !== "string") {
          return null;
        }
        return { displayField: labelValue, color: colorFieldValue };
      }
      return { displayField: labelValue };
    }
  }
  return null;
}

function getManyToManyRelationBadge<
  T extends Resource,
  R extends ResourceRelation<T>,
>(
  item: ResourceDataType<T>,
  badgeResource: Resource,
  badgeConfig: BadgeConfig<R>,
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
        badgeConfig.displayField,
      );

      if (typeof labelValue === "string") {
        retrievedBadges.push({ displayField: labelValue });
      }
    }
  }
  return retrievedBadges;
}

export function getItemBadges<T extends Resource>(
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
        ([relationName]) =>
          relationName === (badgeResource as unknown as ResourceRelation<T>),
      ) ?? [];

    if (relationResource == null || relationDefinition == null) {
      logger.warn(
        { relationResource, relationDefinition },
        "Skipping badge retrieval due to null relation or field",
      );
      continue;
    }

    let newBadges: (ItemBadge | null)[] = [];
    switch (relationDefinition.type) {
      case RelationType.ManyToOne: {
        newBadges = [
          getManyToOneRelationBadge(
            item,
            relationResource,
            relationDefinition,
            relatedResources,
            badgeConfig as unknown as BadgeConfig<typeof relationResource>,
          ),
        ];
        break;
      }
      case RelationType.ManyToMany: {
        newBadges = getManyToManyRelationBadge(
          item,
          badgeResource,
          badgeConfig as unknown as BadgeConfig<typeof relationResource>,
        );
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
    for (const newBadge of newBadges) {
      if (
        newBadge !== null &&
        !badges.some((badge) => badge.displayField === newBadge.displayField)
      ) {
        badges.push(newBadge);
      }
    }
  }
  return badges;
}
