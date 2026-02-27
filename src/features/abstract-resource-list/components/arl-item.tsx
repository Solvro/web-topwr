import type { Ref } from "react";

import { DragHandle } from "@/components/core/drag-handle";
import type { DragHandleProps } from "@/components/core/drag-handle";
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

import { getItemBadges } from "../lib/get-item-badges";
import type { ListItem } from "../types/internal";
import { ResourceBadge } from "./resource-badge";
import { ToggleOrganizationStatusButton } from "./toggle-status-button";

export interface ItemProps<T extends EditableResource> {
  ref?: Ref<HTMLLIElement>;
  item: ResourceDataType<T>;
  resource: T;
  relatedResources: ResourceRelations<T>;
  dragHandleProps?: Omit<DragHandleProps, "className">;
}

/** TODO: pass custom delete functionality as a prop, which would eliminate this helper */
const isStudentOrganizationProps = <T extends EditableResource>(
  props: ItemProps<T>,
): props is ItemProps<T> & {
  resource: Resource.StudentOrganizations;
  item: ResourceDataType<Resource.StudentOrganizations>;
} => props.resource === Resource.StudentOrganizations;

export function ArlItem<T extends EditableResource>(props: ItemProps<T>) {
  const { ref, item, resource, relatedResources, dragHandleProps } = props;

  const metadata = getResourceMetadata(resource);
  const id = getResourcePkValue(resource, item);
  const listItem: ListItem = {
    id,
    ...metadata.itemMapper(item),
  };
  const badges = getItemBadges(item, resource, relatedResources);
  const shortDescription =
    listItem.shortDescription == null
      ? listItem.shortDescription
      : listItem.shortDescription.trim();

  return (
    <li
      ref={ref}
      className="bg-accent text-accent-foreground rounded-xl p-4 marker:content-none max-sm:text-xs"
    >
      <article className="flex flex-row gap-x-4">
        <div className="flex items-center gap-1 sm:gap-2">
          {dragHandleProps == null ? null : <DragHandle {...dragHandleProps} />}
          <Badge className="w-11">{listItem.id}</Badge>
        </div>
        <div className="flex min-w-0 grow flex-col justify-center gap-0.5">
          <header className="flex flex-col gap-y-1">
            {badges.length > 0 && (
              <div className="hidden space-x-2 overflow-hidden md:block">
                {badges.map((badge) => (
                  <ResourceBadge key={badge.badgeText} badge={badge} />
                ))}
              </div>
            )}
            <h2 className="text-lg font-semibold text-balance">
              {listItem.name}
            </h2>
          </header>

          {shortDescription === undefined ? null : (
            <p className="hidden truncate md:block">
              {shortDescription == null || shortDescription === "" ? (
                <span className="text-muted-foreground">Brak opisu</span>
              ) : (
                shortDescription
              )}
            </p>
          )}
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
