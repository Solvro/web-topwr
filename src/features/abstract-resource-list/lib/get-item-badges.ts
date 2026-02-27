import type { Route } from "next";
import type { ZodNumber, ZodString } from "zod";

import { logger } from "@/features/logging";
import type { Resource } from "@/features/resources";
import {
  RelationType,
  getFieldValue,
  getResourceBadgeDefinitions,
  getResourceMetadata,
  getResourcePkValue,
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

/**
 * Helper to construct a badge consistently across all relation types.
 * @param relationResource - Resource to which the badge points.
 * @param relatedResource - The data of the related resource used to populate the badge.
 * @param badgeConfig - Configuration of badge styling and display.
 * @returns An ItemBadge object or null if part of badge configuration is invalid.
 */
function createBadge<R extends Resource>(
  relationResource: R,
  relatedResource: ResourceDataType<R>,
  badgeConfig: BadgeConfig<R>,
): ItemBadge | null {
  const labelValue = getFieldValue(relatedResource, badgeConfig.displayField);
  if (typeof labelValue !== "string") {
    return null;
  }

  const editRoute =
    badgeConfig.link === true
      ? (`/${relationResource}/edit/${getResourcePkValue(relationResource, relatedResource)}` as Route)
      : undefined;

  let color: string | undefined;
  if (badgeConfig.colorField != null) {
    color = getFieldValue(relatedResource, badgeConfig.colorField);

    if (!ColorValueSchema.safeParse(color).success) {
      logger.warn({ labelValue }, "Invalid color value for badge");
      return null;
    }
  }

  return {
    badgeText: labelValue,
    editRoute,
    color,
  };
}

/**
 * Generates a badge for a Many-To-One relationship.
 * Extracts the foreign key from the primary item, finds the matching related resource
 * from the provided pool, and constructs a badge for it.
 * @param item - The primary resource data item.
 * @param relationResource - The identifier for the relation type.
 * @param relationDefinition - The relation metadata defining the foreign key.
 * @param relatedResources - A dictionary containing arrays of related resource data.
 * @param badgeConfig - Configuration of badge styling and display.
 * @returns An ItemBadge object, or null for incomplete/incorrect data.
 */
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

  const relatedResource = relatedResources[relationResource].find(
    (resource) => resource.id === foreignKeyValue,
  );

  if (relatedResource == null) {
    return null;
  }

  return createBadge(
    relationResource,
    relatedResource as ResourceDataType<R>,
    badgeConfig,
  );
}

/**
 * Generates an array of badges for a Many-To-Many relationship.
 * Retrieves nested relation items directly from the primary item
 * and iterates over them to construct a badge for each.
 * @param item - The primary resource data item.
 * @param badgeResource - The identifier for the badge resource.
 * @param badgeConfig - Configuration of badge styling and display.
 * @returns An array of valid ItemBadge objects.
 */
function getManyToManyRelationBadge<
  T extends Resource,
  R extends ResourceRelation<T>,
>(
  item: ResourceDataType<T>,
  badgeResource: R,
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
      const badge = createBadge(
        badgeResource,
        relationItem as ResourceDataType<R>,
        badgeConfig,
      );
      if (badge != null) {
        retrievedBadges.push(badge);
      }
    }
  }
  return retrievedBadges;
}

/**
 * Generates an array of badges for a One-To-Many relationship.
 * Scans the pre-fetched related resources to find entries where the foreign key matches
 * the primary item's ID, generating unique badges.
 * @param item - The primary resource data item.
 * @param resource - The identifier of the primary resource.
 * @param relationResource - The identifier of the related resource type.
 * @param relationDefinition - The relation metadata defining the foreign key.
 * @param relatedResources - A dictionary containing arrays of related resource data.
 * @param badgeConfig - Configuration of badge styling and display.
 * @returns An array of unique ItemBadge objects.
 */
function getOneToManyRelationBadge<
  T extends Resource,
  R extends ResourceRelation<T>,
>(
  item: ResourceDataType<T>,
  resource: T,
  relationResource: R,
  relationDefinition: RelationDefinition<T, R>,
  relatedResources: ResourceRelations<T>,
  badgeConfig: BadgeConfig<R>,
): ItemBadge[] {
  const retrievedBadges: ItemBadge[] = [];

  if (relationDefinition.foreignKey == null) {
    return retrievedBadges;
  }

  const itemId = getResourcePkValue(resource, item);

  const linkedResources = relatedResources[relationResource].filter(
    (relatedItem) => {
      const foreignKeyValue = getFieldValue(
        relatedItem as ResourceDataType<R>,
        relationDefinition.foreignKey as ResourceSchemaKey<
          R,
          ZodString | ZodNumber
        >,
      );
      return String(foreignKeyValue) === itemId;
    },
  );

  const seenLabels = new Set<string>();

  for (const relatedResource of linkedResources) {
    const badge = createBadge(
      relationResource,
      relatedResource as ResourceDataType<R>,
      badgeConfig,
    );

    if (badge != null && !seenLabels.has(badge.badgeText)) {
      seenLabels.add(badge.badgeText);
      retrievedBadges.push(badge);
    }
  }

  return retrievedBadges;
}

/**
 * Retrieve all badges for a specific resource item.
 * Iterates through configured badge definitions for the resource, checks the relationship
 * type (ManyToOne, ManyToMany, OneToMany), delegates to the corresponding helper function,
 * and aggregates the resulting badges into a single array.
 * @param item - The primary resource data item to parse for badges.
 * @param resource - The identifier of the primary resource.
 * @param relatedResources - A dictionary of all fetched related resource data to draw from.
 * @returns A consolidated array of all valid ItemBadge objects.
 */
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
          relationResource,
          badgeConfig as BadgeConfig<typeof relationResource>,
        );
        for (const newBadge of newBadges) {
          badges.add(newBadge);
        }
        break;
      }
      case RelationType.OneToMany: {
        const newBadges = getOneToManyRelationBadge(
          item,
          resource,
          relationResource,
          relationDefinition,
          relatedResources,
          badgeConfig as BadgeConfig<typeof relationResource>,
        );
        for (const newBadge of newBadges) {
          badges.add(newBadge);
        }
        break;
      }
    }
  }

  const badgesArray = [...badges];

  if (badgesArray.length <= 3) {
    return badgesArray;
  }

  return [
    ...badgesArray.slice(0, 3),
    { badgeText: `+${String(badges.size - 3)}` },
  ];
}
