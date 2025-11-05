import {
  LIST_RESULTS_PER_PAGE,
  SORT_FILTER_DEFAULT_VALUES,
} from "@/config/constants";
import { SortDirection } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { env } from "@/config/env";
import { fetchMutation, fetchQuery } from "@/lib/fetch-utils";
import type {
  GetResourcesResponse,
  GetResourcesResponsePaginated,
} from "@/types/api";
import type { FilterDefinitions } from "@/types/components";
import type { SortFiltersFormValuesNarrowed } from "@/types/forms";

import { sanitizeFilteredFields } from "./sort-filters";

/**
 * Determines the fetch configuration to use based on the provided arguments.
 * In some environments, such as vitest, using the FormData approach can cause fetches to freeze,
 * so it is useful to be able to use the direct upload option.
 *
 * @param file the file to upload.
 * @param extension the file extension (optional). If specified, the file is sent directly and the extension is taken from this parameter.
 * @returns an object containing the fetch options.
 */
function getFileFetchOptions(file: File, extension?: string) {
  if (extension == null) {
    const formData = new FormData();
    formData.append("file", file);
    return { body: formData };
  }
  return {
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  };
}

/**
 * Uploads a file to the backend file storage.
 *
 * @param uploadOptions an object containing the upload options.
 * @param uploadOptions.file the file to upload (can be taken directly from an input element).
 * @param uploadOptions.extension the file extension (optional). By default, files are sent using FormData and the extension is inferred from the filename. If specified, the file is sent directly and the extension is taken from this parameter.
 * @param uploadOptions.accessTokenOverride an optional access token to use instead of the one from the auth context.
 * @returns an object containing the full response, the file UUID (simultaneously the saved filename without extension), and the file extension.
 */
export async function uploadFile({
  file,
  extension,
  accessTokenOverride,
}: {
  file: File;
  extension?: string;
  accessTokenOverride?: string;
}) {
  const response = await fetchMutation<{ key: string }>(
    extension == null ? "files" : `files?ext=${extension}`,
    {
      method: "POST",
      ...getFileFetchOptions(file, extension),
      accessTokenOverride,
    },
  );
  const [uuid, fileExtension] = response.key.split(".");
  return { response, uuid, fileExtension };
}

export async function fetchResources<T extends Resource, P extends number>(
  resource: T,
  page: P = 1 as P,
  {
    sortDirection = SORT_FILTER_DEFAULT_VALUES.sortDirection,
    sortBy = SORT_FILTER_DEFAULT_VALUES.sortBy,
    filters = SORT_FILTER_DEFAULT_VALUES.filters,
  }: Partial<SortFiltersFormValuesNarrowed> = {},
  filterDefinitions: Partial<FilterDefinitions<T>> = {},
): Promise<
  P extends -1 ? GetResourcesResponse<T> : GetResourcesResponsePaginated<T>
> {
  const sort = `${sortDirection === SortDirection.Ascending ? "+" : "-"}${sortBy ?? "order"}`;

  const search = sanitizeFilteredFields(filterDefinitions, filters);
  if (page > 0) {
    search.set("page", String(page));
    search.set("limit", String(LIST_RESULTS_PER_PAGE));
  }
  search.set("sort", sort);

  const searchString = `?${search.toString()}`;

  const result = await fetchQuery<GetResourcesResponsePaginated<T>>(
    searchString,
    {
      resource,
    },
  );
  return result;
}

export const getVersionedApiBase = (version = 1) =>
  `${env.NEXT_PUBLIC_API_URL}/api/v${String(version)}`;
