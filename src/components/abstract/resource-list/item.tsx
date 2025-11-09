import type { ComponentType, Ref } from "react";
import type * as z from "zod";

import { ToggleOrganizationStatusButton } from "@/components/abstract/toggle-status-button";
import { Badge } from "@/components/ui/badge";
import { RelationType, Resource } from "@/config/enums";
import {
  getResourceMetadata,
  getResourceRelationDefinitions,
  typedKeys,
} from "@/lib/helpers";
import type { EditableResource, ListItem, ResourceDataType } from "@/types/app";
import type { ResourceRelations } from "@/types/components";
import type { ResourceSchemaKey } from "@/types/forms";

import { EditButton } from "../edit-button";
import { DragHandle } from "./drag-handle";

export const isManyToOneRelationDefinition = <T extends Resource>(
  definition: unknown,
): definition is {
  type: RelationType.ManyToOne;
  foreignKey: ResourceSchemaKey<T, z.ZodString | z.ZodNumber>;
} => {
  return (
    typeof definition === "object" &&
    definition !== null &&
    "type" in definition &&
    definition.type === RelationType.ManyToOne
  );
};

interface ItemProps<T extends EditableResource> {
  ref?: Ref<HTMLLIElement>;
  item: ResourceDataType<T>;
  resource: T;
  relatedResources: ResourceRelations<T>;
  orderable?: boolean;
}

const isStudentOrganizationProps = <T extends EditableResource>(
  props: ItemProps<T>,
): props is ItemProps<T> & {
  resource: Resource.StudentOrganizations;
  item: ResourceDataType<Resource.StudentOrganizations>;
} => props.resource === Resource.StudentOrganizations;

export function getBadgeLabels<T extends EditableResource>(
  item: ResourceDataType<T>,
  listItem: ListItem,
  resource: T,
  relatedResources: ResourceRelations<T>,
) {
  const labels: string[] = [];
  const relationDefinitions = getResourceRelationDefinitions(resource);

  for (const badge of listItem.badges ?? []) {
    for (const relationName of typedKeys(relationDefinitions)) {
      const relation = relationDefinitions[relationName];
      if (!isManyToOneRelationDefinition(relation)) {
        continue;
      }

      const foreignKey = relation.foreignKey as keyof typeof item;
      const foreignKeyValue = item[foreignKey];
      if (foreignKeyValue == null) {
        continue;
      }

      const relatedMap = relatedResources[relationName];
      const related = relatedMap[foreignKeyValue as keyof typeof relatedMap];
      if (related == null) {
        continue;
      }

      labels.push(
        (related as Record<PropertyKey, unknown>)[
          badge.displayField as PropertyKey
        ] as string,
      );

      break;
    }
  }

  return labels;
}

export function AbstractResourceListItem<T extends EditableResource>(
  props: ItemProps<T>,
) {
  const { ref, item, resource, relatedResources, orderable = false } = props;

  const metadata = getResourceMetadata(resource);
  const listItem: ListItem = {
    id: item.id,
    ...metadata.itemMapper(item),
  };

  return (
    <li
      ref={ref}
      className="bg-accent text-accent-foreground flex flex-row items-center space-x-4 rounded-xl p-4"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 sm:gap-2">
          {orderable ? <DragHandle item={listItem} /> : null}
          <Badge>{listItem.id}</Badge>
        </div>
      </div>
      <div className="grow space-y-1 overflow-hidden">
        <div className="flex w-full flex-row justify-start space-x-2">
          <p className="font-semibold">{listItem.name}</p>
          {getBadgeLabels(item, listItem, resource, relatedResources).map(
            (label) => (
              <Badge
                key={label}
                className="border-muted-foreground text-muted-foreground bg-transparent py-0"
              >
                {label}
              </Badge>
            ),
          )}
        </div>
        <p className="hidden truncate md:block">
          {listItem.shortDescription == null ||
          listItem.shortDescription.trim() === "" ? (
            <span className="text-muted-foreground">Brak opisu</span>
          ) : (
            listItem.shortDescription
          )}
        </p>
      </div>
      <div className="flex flex-row space-x-0.5 sm:space-x-2">
        <EditButton resource={resource} id={listItem.id} />

        {isStudentOrganizationProps(props) ? (
          <ToggleOrganizationStatusButton
            id={Number(listItem.id)}
            resource={resource}
            organizationStatus={props.item.organizationStatus}
          />
        ) : null}
      </div>
    </li>
  );
}

export function AbstractResourceListItems<T extends EditableResource>({
  items,
  resource,
  relatedResources,
  orderable = false,
  ItemComponent = AbstractResourceListItem,
}: {
  items: ResourceDataType<T>[];
  resource: T;
  relatedResources: ResourceRelations<T>;
  orderable?: boolean;
  ItemComponent?: ComponentType<ItemProps<T>>;
}) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <ItemComponent
          key={String(item.id)}
          item={item}
          resource={resource}
          relatedResources={relatedResources}
          orderable={orderable}
        />
      ))}
    </ul>
  );
}
