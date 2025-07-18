import { Plus, SquarePen } from "lucide-react";
import Link from "next/link";

import {
  LIST_RESULTS_PER_PAGE,
  resourcePathToApiPath,
} from "@/config/constants";
import { fetchQuery } from "@/lib/fetch-utils";
import type { ListItem, Resource, ResourceTypes } from "@/types/app";

import { DeleteButtonWithDialog } from "../delete-button-with-dialog";
import { PaginationComponent } from "../pagination";
import { Button } from "../ui/button";

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
      `${resourcePathToApiPath[resource]}?page=${String(page)}&limit=${String(resultsPerPage)}`,
    );
    return result;
  } catch (error) {
    console.error(`Error fetching ${resource}:`, error);
    return { data: [], meta: { total: 0 } };
  }
}

export async function AbstractResourceList<T extends Resource>({
  resource,
  searchParams,
  mapItemToList,
  addButtonLabel = "Dodaj",
}: {
  resource: T;
  searchParams: Promise<{ page?: string }>;
  mapItemToList: (item: ResourceTypes[T]) => ListItem;
  addButtonLabel?: string;
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
        {listItems.map((item) => (
          <div
            key={item.id}
            className="bg-background-secondary grid grid-cols-[1fr_auto] items-center gap-x-1 rounded-xl p-4 md:grid-cols-[12rem_1fr_auto] md:gap-x-4 xl:grid-cols-[20rem_1fr_auto]"
          >
            <span className="font-medium md:text-center">{item.name}</span>
            <span className="hidden truncate md:block">
              {item.shortDescription == null ||
              item.shortDescription.trim() === ""
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
        ))}
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
