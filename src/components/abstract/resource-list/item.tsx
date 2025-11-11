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
      className="bg-accent text-accent-foreground rounded-xl p-4 marker:content-none max-sm:text-xs"
    >
      <article className="grid grid-cols-[1fr_auto] items-center gap-x-1 md:grid-cols-[1fr_2fr_auto] md:gap-x-4">
        <header className="flex items-center gap-4">
          <div className="flex items-center gap-1 sm:gap-2">
            {orderable ? <DragHandle item={listItem} /> : null}
            <Badge>{listItem.id}</Badge>
          </div>
          <h2 className="w-full font-medium text-balance md:text-center">
            {listItem.name}
          </h2>
        </header>
        <p className="hidden truncate md:block">
          {listItem.shortDescription == null ||
          listItem.shortDescription.trim() === "" ? (
            <span className="text-muted-foreground">Brak opisu</span>
          ) : (
            listItem.shortDescription
          )}
        </p>
        <footer className="flex gap-0.5 sm:gap-2">
          <EditButton resource={resource} id={listItem.id} />
          {isStudentOrganizationProps(props) ? (
            <ToggleOrganizationStatusButton
              id={Number(listItem.id)}
              resource={resource}
              organizationStatus={props.item.organizationStatus}
            />
          ) : null}
        </footer>
      </article>
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
    <ul className="flex flex-col gap-4">
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
