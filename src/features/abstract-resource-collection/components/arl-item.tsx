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
import { cn } from "@/lib/utils";
import type { ResourceRelations } from "@/types/components";

import { getItemBadges } from "../lib/get-item-badges";
import type { ListItem } from "../types/internal";
import { getBadgeStyles } from "../utils/get-badge-styles";
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
  const listItem: ListItem = {
    id,
    ...metadata.itemMapper(item),
  };

  return (
    <li
      ref={ref}
      className="bg-accent text-accent-foreground rounded-xl p-4 marker:content-none max-sm:text-xs"
    >
      <article className="flex flex-row gap-x-4">
        <div className="flex items-center gap-1 sm:gap-2">
          {orderable ? <ArlItemDragHandle item={listItem} /> : null}
          <Badge className="w-11">{listItem.id}</Badge>
        </div>
        <div className="flex min-w-0 grow flex-col justify-center gap-0.5">
          <header className="flex flex-col gap-y-1">
            <div className="hidden space-x-2 overflow-hidden md:block">
              {getItemBadges(item, resource, relatedResources).map((badge) => {
                const { className, style } = getBadgeStyles(badge);
                return (
                  <Badge
                    key={badge.displayField}
                    className={cn("py-0.5", className)}
                    style={style}
                  >
                    {badge.displayField}
                  </Badge>
                );
              })}
            </div>
            <h2 className="text-lg font-semibold text-balance">
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
