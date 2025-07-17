import { AbstractList } from "@/components/abstract-list";
import { fetchQuery } from "@/lib/fetch-utils";
import type { ListItem, Resource, ResourceTypes } from "@/types/app";

interface ApiResponse<T> {
  data: T[];
  meta: { total: number };
}

async function fetchResource<T extends Resource>(
  resource: T,
  page: number,
  resultsPerPage: number,
): Promise<ApiResponse<ResourceTypes[T]>> {
  try {
    const result = await fetchQuery<ApiResponse<ResourceTypes[T]>>(
      `${resource}?page=${String(page)}&limit=${String(resultsPerPage)}`,
    );
    return result;
  } catch (error) {
    console.error(`Error fetching ${resource}:`, error);
    return { data: [], meta: { total: 0 } };
  }
}

export async function AbstractResource<T extends Resource>({
  resource,
  searchParams,
  mapItemToList,
}: {
  resource: T;
  searchParams: Promise<{ page?: string }>;
  mapItemToList: (item: ResourceTypes[T]) => ListItem;
}) {
  const resolvedSearchParameters = await searchParams;
  const page = Number.parseInt(resolvedSearchParameters.page ?? "1", 10);
  const resultsPerPage = 10;

  const { data, meta } = await fetchResource(resource, page, resultsPerPage);

  const totalPages = Math.ceil(meta.total / resultsPerPage);
  const resultsNumber = meta.total;
  const listItems: ListItem[] = data.map((item: ResourceTypes[T]) =>
    mapItemToList(item),
  );

  return (
    <AbstractList
      resource={resource}
      listItems={listItems}
      page={page}
      totalPages={totalPages}
      resultsNumber={resultsNumber}
    />
  );
}
