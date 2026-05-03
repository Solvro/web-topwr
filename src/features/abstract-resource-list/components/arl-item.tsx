import type { ReactNode, Ref } from "react";

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
import { isEmptyValue } from "@/utils";

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
  actions?: ReactNode;
}

/** TODO: pass custom delete functionality as a prop, which would eliminate this helper */
const isStudentOrganizationProps = <T extends EditableResource>(
  props: ItemProps<T>,
): props is ItemProps<T> & {
  resource: Resource.StudentOrganizations;
  item: ResourceDataType<Resource.StudentOrganizations>;
} => props.resource === Resource.StudentOrganizations;

export function ArlItem<T extends EditableResource>(props: ItemProps<T>) {
  const { ref, item, resource, relatedResources, dragHandleProps, actions } =
    props;

  const metadata = getResourceMetadata(resource);
  const id = getResourcePkValue(resource, item);
  const listItem: ListItem = {
    id,
    ...metadata.itemMapper(item),
  };
  const badges = getItemBadges(item, resource, relatedResources);
  const shortDescription =
    listItem.description == null
      ? listItem.description
      : listItem.description.trim();

  return (
    <li
      ref={ref}
      className="bg-accent text-accent-foreground rounded-xl p-4 marker:content-none max-sm:text-xs"
    >
      <article className="flex flex-row gap-x-4">
        {metadata.showItemId === false && dragHandleProps == null ? null : (
          <div className="flex items-center gap-1 sm:gap-2">
            {dragHandleProps == null ? null : (
              <DragHandle {...dragHandleProps} />
            )}
            {metadata.showItemId === false ? null : (
              <Badge className="w-11">{listItem.id}</Badge>
            )}
          </div>
        )}
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
              {isEmptyValue(listItem.descriptor) ? (
                listItem.name
              ) : (
                <>
                  {listItem.name}{" "}
                  <i className="font-normal">– {listItem.descriptor}</i>
                </>
              )}
            </h2>
          </header>

          {shortDescription === undefined ? null : (
            <p className="hidden truncate md:block">
              {isEmptyValue(shortDescription) ? (
                <span className="text-muted-foreground">Brak opisu</span>
              ) : (
                shortDescription
              )}
            </p>
          )}
        </div>
        <footer className="flex items-center gap-0.5 sm:gap-2">
          {actions ?? (
            <>
              <EditButton resource={resource} id={listItem.id} />
              {isStudentOrganizationProps(props) ? (
                <ToggleOrganizationStatusButton
                  id={listItem.id}
                  resource={resource}
                  organizationStatus={props.item.organizationStatus}
                />
              ) : null}
            </>
          )}
        </footer>
      </article>
    </li>
  );
}
