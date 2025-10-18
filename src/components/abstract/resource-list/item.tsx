import type { ComponentType, Ref } from "react";

import { DeleteButtonWithDialog } from "@/components/delete-button-with-dialog";
import { Badge } from "@/components/ui/badge";
import type { Resource } from "@/config/enums";
import { RESOURCE_METADATA } from "@/config/resources";
import type { ListItem, ListItemMapper, ResourceDataType } from "@/types/app";

import { EditButton } from "../edit-button";
import { DragHandle } from "./drag-handle";

interface ItemProps<T extends Resource> {
  ref?: Ref<HTMLLIElement>;
  item: ResourceDataType<T>;
  resource: T;
  orderable?: boolean;
}

export function AbstractResourceListItem<T extends Resource>({
  ref,
  item,
  resource,
  orderable = false,
}: ItemProps<T>) {
  const mapper = RESOURCE_METADATA[resource].itemMapper as ListItemMapper<T>;
  const listItem: ListItem = {
    id: item.id,
    ...mapper(item),
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
        listItem.shortDescription.trim() === ""
          ? "Brak opisu"
          : listItem.shortDescription}
      </span>
      <div className="space-x-0.5 sm:space-x-2">
        <EditButton resource={resource} id={listItem.id} />
        <DeleteButtonWithDialog resource={resource} id={listItem.id} />
      </div>
    </li>
  );
}

export function AbstractResourceListItems<T extends Resource>({
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
