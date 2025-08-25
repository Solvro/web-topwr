import { Plus, SquarePen } from "lucide-react";
import Link from "next/link";

import { DeleteButtonWithDialog } from "@/components/delete-button-with-dialog";
import { PaginationComponent } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { LIST_RESULTS_PER_PAGE } from "@/config/constants";
import { DeclensionCase } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { fetchQuery } from "@/lib/fetch-utils";
import { encodeQueryComponent } from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import type { ListItem, ResourceDataType } from "@/types/app";

import { SortFilters } from "./sort-filters";

interface ApiResponse<T extends Resource> {
  data: ResourceDataType<T>[];
  meta: { total: number };
}

async function fetchResources<T extends Resource>(
  resource: T,
  page: number,
  resultsPerPage: number,
  sortBy: string,
  sortDirection: "+" | "-",
  searchField?: string,
  searchTerm?: string,
): Promise<ApiResponse<T>> {
  const search =
    searchField == null || searchTerm == null
      ? ""
      : `${encodeQueryComponent(searchField)}=%${encodeQueryComponent(searchTerm)}%&`;
  try {
    const result = await fetchQuery<ApiResponse<T>>(
      `?${search}page=${String(page)}&limit=${String(resultsPerPage)}&sort=${sortDirection}${sortBy}`,
      { resource },
    );
    return result;
  } catch (error) {
    console.error(`Error fetching ${resource}:`, error);
    return { data: [], meta: { total: 0 } };
  }
}

export interface ListSearchParameters {
  page?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  searchField?: string;
  searchTerm?: string;
}

export async function AbstractResourceList<T extends Resource>({
  resource,
  searchParams,
  mapItemToList,
  sortFields = {},
  searchFields = {},
}: {
  resource: T;
  sortFields?: Record<string, string>;
  searchFields?: Record<string, string>;
  searchParams: Promise<ListSearchParameters>;
  mapItemToList: (item: ResourceDataType<T>) => ListItem;
}) {
  const resolvedSearchParameters = await searchParams;
  const page = Number.parseInt(resolvedSearchParameters.page ?? "1", 10);
  const sortBy = resolvedSearchParameters.sortBy ?? "id";
  const sortDirection =
    resolvedSearchParameters.sortDirection === "desc" ? "-" : "+";
  const searchField = resolvedSearchParameters.searchField;
  const searchTerm = resolvedSearchParameters.searchTerm;

  const { data, meta } = await fetchResources(
    resource,
    page,
    LIST_RESULTS_PER_PAGE,
    sortBy,
    sortDirection,
    searchField,
    searchTerm,
  );

  const totalPages = Math.ceil(meta.total / LIST_RESULTS_PER_PAGE);
  const resultsNumber = meta.total;
  const listItems: ListItem[] = data.map((item: ResourceDataType<T>) =>
    mapItemToList(item),
  );

  const resourceAccusative = declineNoun(resource, {
    case: DeclensionCase.Accusative,
  });

  return (
    <div className="flex h-full flex-col space-y-4">
      <SortFilters sortFields={sortFields} searchFields={searchFields} />
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
              <Button
                variant="ghost"
                className="h-10 w-10"
                asChild
                aria-label={`Edytuj ${resourceAccusative}`}
              >
                <Link href={`/${resource}/edit/${String(item.id)}`}>
                  <SquarePen />
                </Link>
              </Button>
              <DeleteButtonWithDialog
                resource={resource}
                id={item.id}
                itemName={item.name}
              />
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
          searchParams={resolvedSearchParameters}
        />

        <Button asChild>
          <Link href={`/${resource}/create`}>
            Dodaj {resourceAccusative}
            <Plus />
          </Link>
        </Button>
      </div>
    </div>
  );
}
