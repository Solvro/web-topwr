import type { Ref } from "react";

import { Badge } from "@/components/ui/badge";
import {
  EditButton,
  Resource,
  getResourceMetadata,
  getResourcePkValue,
} from "@/features/resources";
import type {
  EditableResource,
  ResourceDataType,
} from "@/features/resources/types";
import type { ResourceRelations } from "@/types/components";

import type { ListItem } from "../types/internal";
import { getBadgeLabels } from "../utils/get-badge-labels";
import { ArlItemDragHandle } from "./arl-item-drag-handle";
import { ToggleOrganizationStatusButton } from "./toggle-status-button";

export interface ItemProps<T extends EditableResource> {
  ref?: Ref<HTMLLIElement>;
  item: ResourceDataType<T>;
  resource: T;
  relatedResources: ResourceRelations<T>;
  orderable?: boolean;
}

/** TODO: pass custom delete functionality as a prop, which would eliminate this helper */
const isStudentOrganizationProps = <T extends EditableResource>(
  props: ItemProps<T>,
): props is ItemProps<T> & {
  resource: Resource.StudentOrganizations;
  item: ResourceDataType<Resource.StudentOrganizations>;
} => props.resource === Resource.StudentOrganizations;

export function ArlItem<T extends EditableResource>(props: ItemProps<T>) {
  const { ref, item, resource, relatedResources, orderable = false } = props;

  const metadata = getResourceMetadata(resource);
  const id = getResourcePkValue(resource, item);
  const listItem: ListItem = { id, ...metadata.itemMapper(item) };

  return (
    <li
      ref={ref}
      className="bg-accent text-accent-foreground rounded-xl p-4 marker:content-none max-sm:text-xs"
    >
      <article className="flex flex-row space-x-4">
        <div className="flex items-center gap-1 sm:gap-2">
          {orderable ? <ArlItemDragHandle item={listItem} /> : null}
          <Badge className="w-11">{listItem.id}</Badge>
        </div>
        <div className="flex min-w-0 grow flex-col justify-center md:space-y-2">
          <header className="flex flex-col">
            <h2 className="font-semibold text-balance">{listItem.name}</h2>
            <div className="hidden space-x-2 overflow-hidden md:block">
              {getBadgeLabels(item, listItem, resource, relatedResources).map(
                (label) => (
                  <Badge
                    key={label}
                    className="border-muted-foreground text-muted-foreground bg-transparent py-0.5"
                  >
                    {label}
                  </Badge>
                ),
              )}
            </div>
          </header>
          <p className="hidden truncate md:block">
            {listItem.shortDescription == null ||
            listItem.shortDescription.trim() === "" ? (
              <span className="text-muted-foreground">Brak opisu</span>
            ) : (
              listItem.shortDescription
            )}
          </p>
        </div>
        <footer className="flex items-center gap-0.5 sm:gap-2">
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
