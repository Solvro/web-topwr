import { AbstractList } from "@/components/abstract-list";
import { fetchQuery } from "@/lib/fetch-utils";
import type { ListItem, Resource } from "@/types/app";

interface ApiResponse<T> {
  data: T[];
  meta: { total: number };
}

async function fetchResource<T>(
  resource: Resource,
  page: number,
  resultsPerPage: number,
): Promise<ApiResponse<T>> {
  try {
    const result = await fetchQuery<ApiResponse<T>>(
      `${resource}?page=${String(page)}&limit=${String(resultsPerPage)}`,
    );
    return result;
  } catch (error) {
    console.error(`Error fetching ${resource}:`, error);
    return { data: [], meta: { total: 0 } };
  }
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export async function AbstractResource<T>({
  resource,
  searchParams,
  mapItemToList,
}: {
  resource: Resource;
  searchParams: Promise<{ page?: string }>;
  mapItemToList: (item: T) => ListItem;
}) {
  const resolvedSearchParameters = await searchParams;
  const page = Number.parseInt(resolvedSearchParameters.page ?? "1", 10);
  const resultsPerPage = 10;

  const { data, meta } = await fetchResource<T>(resource, page, resultsPerPage);

  const totalPages = Math.ceil(meta.total / resultsPerPage);
  const resultsNumber = meta.total;
  const listItems: ListItem[] = data.map((item: T) => mapItemToList(item));

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
