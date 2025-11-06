import type { ComponentType, Ref } from "react";

import { ToggleOrganizationStatusButton } from "@/components/abstract/toggle-status-button";
import { Badge } from "@/components/ui/badge";
import { Resource } from "@/config/enums";
import { getResourceMetadata } from "@/lib/helpers";
import type { EditableResource, ListItem, ResourceDataType } from "@/types/app";

import { EditButton } from "../edit-button";
import { DragHandle } from "./drag-handle";

interface ItemProps<T extends EditableResource> {
  ref?: Ref<HTMLLIElement>;
  item: ResourceDataType<T>;
  resource: T;
  orderable?: boolean;
}

const isStudentOrganizationProps = (
  props: ItemProps<EditableResource>,
): props is ItemProps<Resource.StudentOrganizations> =>
  props.resource === Resource.StudentOrganizations;

export function AbstractResourceListItem<T extends EditableResource>(
  props: ItemProps<T>,
) {
  const { ref, item, resource, orderable = false } = props;

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
          {listItem.badges?.map((badge) => (
            <Badge
              key={badge}
              className="border-muted-foreground text-muted-foreground bg-transparent py-0"
            >
              {badge}
            </Badge>
          ))}
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
  orderable = false,
  ItemComponent = AbstractResourceListItem,
}: {
  items: ResourceDataType<T>[];
  resource: T;
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
          orderable={orderable}
        />
      ))}
    </ul>
  );
}
