import { Plus, SquarePen } from "lucide-react";
import Link from "next/link";

import { DeleteButtonWithDialog } from "@/components/delete-button-with-dialog";
import { PaginationComponent } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { LIST_RESULTS_PER_PAGE, RESOURCE_API_PATHS } from "@/config/constants";
import type { Resource } from "@/config/enums";
import { fetchQuery } from "@/lib/fetch-utils";
import type { ListItem, ResourceTypes } from "@/types/app";

import { DragHandle } from "./orderable-list/drag-handle";
import { OrderableItemWrapper } from "./orderable-list/orderable-item-wrapper";

interface ApiResponse<T extends Resource> {
  data: ResourceTypes[T][];
  meta: { total: number };
}

async function fetchResource<T extends Resource>(
  resource: T,
  page: number,
  resultsPerPage: number,
): Promise<ApiResponse<T>> {
  try {
    const result = await fetchQuery<ApiResponse<T>>(
      `${RESOURCE_API_PATHS[resource]}?page=${String(page)}&limit=${String(resultsPerPage)}`,
    );
    return result;
  } catch (error) {
    console.error(`Error fetching ${resource}:`, error);
    return { data: [], meta: { total: 0 } };
  }
}

export function AbstractResourceListItem({
  item,
  resource,
  orderable = false,
}: {
  item: ListItem;
  resource: Resource;
  orderable?: boolean;
}) {
  return (
    <div className="bg-background-secondary grid grid-cols-[1fr_auto] items-center gap-x-1 rounded-xl p-4 md:grid-cols-[12rem_1fr_auto] md:gap-x-4 xl:grid-cols-[20rem_1fr_auto]">
      <div className="flex h-full items-center">
        {orderable ? <DragHandle item={item} /> : null}
        <span className="w-full font-medium md:text-center">{item.name}</span>
      </div>
      <span className="hidden truncate md:block">
        {item.shortDescription == null || item.shortDescription.trim() === ""
          ? "Brak opisu"
          : item.shortDescription}
      </span>
      <div className="space-x-0.5 sm:space-x-2">
        <Button variant="ghost" className="h-10 w-10" asChild>
          <Link href={`/${resource}/edit/${String(item.id)}`}>
            <SquarePen />
          </Link>
        </Button>
        <DeleteButtonWithDialog resource={resource} id={item.id} />
      </div>
    </div>
  );
}

export async function AbstractResourceList<T extends Resource>({
  resource,
  searchParams,
  mapItemToList,
  addButtonLabel = "Dodaj",
  orderable = false,
}: {
  resource: T;
  searchParams: Promise<{ page?: string }>;
  mapItemToList: (item: ResourceTypes[T]) => ListItem;
  addButtonLabel?: string;
  orderable?: boolean;
}) {
  const resolvedSearchParameters = await searchParams;
  const page = Number.parseInt(resolvedSearchParameters.page ?? "1", 10);

  const { data, meta } = await fetchResource(
    resource,
    page,
    LIST_RESULTS_PER_PAGE,
  );

  const totalPages = Math.ceil(meta.total / LIST_RESULTS_PER_PAGE);
  const resultsNumber = meta.total;
  const listItems: ListItem[] = data.map((item: ResourceTypes[T]) =>
    mapItemToList(item),
  );

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="grow basis-[0] space-y-4 overflow-y-auto pr-2">
        {orderable ? (
          <OrderableItemWrapper items={listItems} resource={resource} />
        ) : (
          listItems.map((item) => (
            <AbstractResourceListItem
              key={item.id}
              item={item}
              resource={resource}
            />
          ))
        )}
      </div>
      <div className="flex flex-col items-center justify-between gap-y-4 sm:flex-row">
        <PaginationComponent
          page={page}
          totalPages={totalPages}
          currentResultsNumber={listItems.length}
          resultsNumber={resultsNumber}
        />

        <Button asChild>
          <Link href={`/${resource}/create`}>
            {addButtonLabel}
            <Plus />
          </Link>
        </Button>
      </div>
    </div>
  );
}
