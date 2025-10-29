import type { ComponentType, Ref } from "react";

import { ToggleOrganizationStatusButton } from "@/components/archive";
import { DeleteButtonWithDialog } from "@/components/delete-button-with-dialog";
import { Badge } from "@/components/ui/badge";
import { Resource } from "@/config/enums";
import { getResourceMetadata } from "@/lib/helpers/app";
import type { ListItem, ResourceDataType, RoutableResource } from "@/types/app";

import { EditButton } from "../edit-button";
import { DragHandle } from "./drag-handle";

interface ItemProps<T extends RoutableResource> {
  ref?: Ref<HTMLLIElement>;
  item: ResourceDataType<T>;
  resource: T;
  orderable?: boolean;
}

const isStudentOrganizationProps = (
  props: ItemProps<RoutableResource>,
): props is ItemProps<Resource.StudentOrganizations> =>
  props.resource === Resource.StudentOrganizations;

export function AbstractResourceListItem<T extends RoutableResource>(
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
      className="bg-background-secondary grid grid-cols-[1fr_auto] items-center gap-x-1 rounded-xl p-4 md:grid-cols-[1fr_2fr_auto] md:gap-x-4"
    >
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
          {orderable ? <DragHandle item={listItem} /> : null}
          <Badge>{listItem.id}</Badge>
        </div>
        <span className="w-full font-medium md:text-center">
          {listItem.name}
        </span>
      </div>
      <span className="hidden truncate md:block">
        {listItem.shortDescription == null ||
        listItem.shortDescription.trim() === "" ? (
          <p className="text-muted-foreground">Brak opisu</p>
        ) : (
          listItem.shortDescription
        )}
      </span>
      <div className="space-x-0.5 sm:space-x-2">
        <EditButton resource={resource} id={listItem.id} />

        {isStudentOrganizationProps(props) ? (
          <ToggleOrganizationStatusButton
            id={Number(listItem.id)}
            resource={resource}
            organizationStatus={props.item.organizationStatus}
          />
        ) : (
          <DeleteButtonWithDialog resource={resource} id={listItem.id} />
        )}
      </div>
    </li>
  );
}

export function AbstractResourceListItems<T extends RoutableResource>({
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
