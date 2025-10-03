import { SquarePen } from "lucide-react";
import Link from "next/link";
import type { Ref } from "react";

import { DeleteButtonWithDialog } from "@/components/delete-button-with-dialog";
import { Button } from "@/components/ui/button";
import { DeclensionCase } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { RESOURCE_METADATA } from "@/config/resources";
import { declineNoun } from "@/lib/polish";
import type { ListItem, ResourceDataType } from "@/types/app";

import { DragHandle } from "./drag-handle";

export function AbstractResourceListItem<T extends Resource>({
  ref,
  item,
  resource,
  orderable = false,
}: {
  ref?: Ref<HTMLLIElement>;
  item: ResourceDataType<T>;
  resource: T;
  orderable?: boolean;
}) {
  const listItem: ListItem = {
    id: item.id,
    ...RESOURCE_METADATA[resource].itemMapper(item),
  };
  return (
    <li
      ref={ref}
      className="bg-background-secondary grid grid-cols-[1fr_auto] items-center gap-x-1 rounded-xl p-4 md:grid-cols-[12rem_1fr_auto] md:gap-x-4 xl:grid-cols-[20rem_1fr_auto]"
    >
      <div className="flex h-full items-center">
        {orderable ? <DragHandle item={listItem} /> : null}
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
        <Button
          variant="ghost"
          className="h-10 w-10"
          asChild
          aria-label={`Edytuj ${declineNoun(resource, { case: DeclensionCase.Accusative })}`}
        >
          <Link href={`/${resource}/edit/${String(listItem.id)}`}>
            <SquarePen />
          </Link>
        </Button>
        <DeleteButtonWithDialog resource={resource} id={listItem.id} />
      </div>
    </li>
  );
}
