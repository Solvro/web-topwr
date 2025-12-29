import type { ZodNumber, ZodString } from "zod";

import { logger } from "@/features/logging";
import type { Resource } from "@/features/resources";
import {
  RelationType,
  getFieldValue,
  getResourceBadgeDefinitions,
  getResourceMetadata,
  getResourceRelationDefinitions,
} from "@/features/resources";
import type {
  RelationDefinition,
  ResourceDataType,
  ResourceRelation,
  ResourceSchemaKey,
} from "@/features/resources/types";
import { ColorValueSchema } from "@/schemas";
import type { ResourceRelations } from "@/types/components";
import { typedEntries } from "@/utils";

import type { BadgeConfig, ItemBadge } from "../types/badges";

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

      if (badgeConfig.colorField == null) {
        return { displayField: labelValue };
      }

      const colorFieldValue = getFieldValue(
        relatedResource,
        badgeConfig.colorField,
      );

      if (!ColorValueSchema.safeParse(colorFieldValue).success) {
        logger.warn({ labelValue }, "Invalid color value for badge");
        return null;
      }

      return { displayField: labelValue, color: colorFieldValue };
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
  resource: T,
  relatedResources: ResourceRelations<T>,
): ItemBadge[] {
  const badgeDefinitions = getResourceBadgeDefinitions(resource);
  if (badgeDefinitions == null) {
    return [];
  }

  const badges = new Set<ItemBadge>();
  const relationDefinitions = getResourceRelationDefinitions(resource);

  for (const [badgeResource, badgeConfig] of typedEntries(badgeDefinitions)) {
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
        const newBadge = getManyToOneRelationBadge(
          item,
          relationResource,
          relationDefinition,
          relatedResources,
          badgeConfig as BadgeConfig<typeof relationResource>,
        );
        if (newBadge !== null) {
          badges.add(newBadge);
        }
        break;
      }
      case RelationType.ManyToMany: {
        const newBadges = getManyToManyRelationBadge(
          item,
          badgeResource,
          badgeConfig as BadgeConfig<typeof relationResource>,
        );
        for (const newBadge of newBadges) {
          badges.add(newBadge);
        }
        break;
      }
      case RelationType.OneToMany: {
        logger.error(
          { resource, item, relatedResources },
          "Badges for one to many relations are not implemented yet - possible configuration error",
        );
        break;
      }
      default: {
        break;
      }
    }
  }
  return [...badges];
}
