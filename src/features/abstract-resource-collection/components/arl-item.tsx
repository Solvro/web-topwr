import type { Ref } from "react";

import { Badge } from "@/components/ui/badge";
import {
  EditButton,
  Resource,
  getFieldValue,
  getResourceMetadata,
  getResourcePk,
} from "@/features/resources";
import type {
  EditableResource,
  ResourceDataType,
  ResourcePk,
} from "@/features/resources/types";

import type { ListItem } from "../types/internal";
import { ArlItemDragHandle } from "./arl-item-drag-handle";
import { ToggleOrganizationStatusButton } from "./toggle-status-button";

export interface ItemProps<T extends EditableResource> {
  ref?: Ref<HTMLLIElement>;
  item: ResourceDataType<T>;
  resource: T;
  orderable?: boolean;
}

/** TODO: pass custom delete functionality as a prop, which would eliminate this helper */
const isStudentOrganizationProps = (
  props: ItemProps<EditableResource>,
): props is ItemProps<Resource.StudentOrganizations> =>
  props.resource === Resource.StudentOrganizations;

export function ArlItem<T extends EditableResource>(props: ItemProps<T>) {
  const { ref, item, resource, orderable = false } = props;

  const metadata = getResourceMetadata(resource);
  const pkField = getResourcePk(resource);
  const id = getFieldValue(item, pkField) as ResourcePk;
  const listItem: ListItem = { id, ...metadata.itemMapper(item) };

  return (
    <li
      ref={ref}
      className="bg-accent text-accent-foreground rounded-xl p-4 marker:content-none max-sm:text-xs"
    >
      <article className="grid grid-cols-[1fr_auto] items-center gap-x-1 md:grid-cols-[1fr_2fr_auto] md:gap-x-4">
        <header className="flex items-center gap-4">
          <div className="flex items-center gap-1 sm:gap-2">
            {orderable ? <ArlItemDragHandle item={listItem} /> : null}
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
