import { Plus, SquarePen } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { DeleteButtonWithDialog } from "@/components/delete-button-with-dialog";
import { PaginationComponent } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { LIST_RESULTS_PER_PAGE, TOAST_MESSAGES } from "@/config/constants";
import { DeclensionCase } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { fetchQuery } from "@/lib/fetch-utils";
import { encodeQueryComponent } from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import type {
  ListItem,
  ResourceDataType,
  ResourceDeclinableField,
  SortDirection,
} from "@/types/app";

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
  const declensions = declineNoun(resource, { plural: true });

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
  } catch {
    toast.error(TOAST_MESSAGES.object(declensions).read.error);
    return { data: [], meta: { total: 0 } };
  }
}

export interface ListSearchParameters {
  page?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  searchField?: string;
  searchTerm?: string;
}

export async function AbstractResourceList<T extends Resource>({
  resource,
  searchParams,
  sortableFields = [],
  searchableFields = [],
  resourceMapper,
}: {
  resource: T;
  searchParams: Promise<ListSearchParameters>;
  sortableFields?: ResourceDeclinableField<T>[];
  searchableFields?: ResourceDeclinableField<T>[];
  resourceMapper: (item: ResourceDataType<T>) => Omit<ListItem, "id">;
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
  const listItems = data.map((item: ResourceDataType<T>) => ({
    id: item.id,
    ...resourceMapper(item),
  }));

  const resourceAccusative = declineNoun(resource, {
    case: DeclensionCase.Accusative,
  });

  return (
    <div className="flex h-full flex-col space-y-4">
      <SortFilters
        sortableFields={sortableFields}
        searchableFields={searchableFields}
      />
      <div
        className="grow basis-[0] space-y-4 overflow-y-auto pr-2"
        data-testid="abstract-resource-list"
      >
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
