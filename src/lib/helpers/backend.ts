import {
  IMPLICIT_SORTABLE_FIELDS,
  LIST_RESULTS_PER_PAGE,
  SORT_DIRECTION_SEPARATOR,
  SORT_FILTER_DEFAULT_VALUES,
} from "@/config/constants";
import { FilterType, SortDirection } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { FetchError, fetchQuery } from "@/lib/fetch-utils";
import type { GetResourcesResponse } from "@/types/api";
import type { FilterDefinitions } from "@/types/components";
import type { FilteredField, SortFiltersFormValues } from "@/types/forms";

import { fetchMutation } from "../fetch-utils";
import { isEmptyValue, isValidSortDirection } from "./typescript";

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

/** Parses a string like +field or -field into distinct, URI-encodable values. */
export const parseSortParameter = (
  sortParameter: string | undefined,
  sortableFields?: string[],
): { sortDirection: SortDirection; sortBy: string } | null => {
  if (isEmptyValue(sortParameter)) {
    return null;
  }
  const [sortDirection, sortBy] = sortParameter.split(
    SORT_DIRECTION_SEPARATOR,
    2,
  );
  if (isEmptyValue(sortBy) || !isValidSortDirection(sortDirection)) {
    return null;
  }
  if (
    sortableFields != null &&
    ![...IMPLICIT_SORTABLE_FIELDS, ...sortableFields].includes(sortBy)
  ) {
    return null;
  }
  return { sortDirection, sortBy };
};

/** Converts the client-side search parameters to backend-compatible filters. */
export const sanitizeFilteredFields = (
  filterDefinitions: FilterDefinitions,
  filters: FilteredField[],
) => {
  const searchParameters = new URLSearchParams();
  for (const { field, value } of filters) {
    if (isEmptyValue(value)) {
      continue;
    }
    if (!(field in filterDefinitions)) {
      if (process.env.NODE_ENV !== "test") {
        console.warn("Ignoring unknown filter parameter", { field, value });
      }
      continue;
    }
    const options = filterDefinitions[field];
    const filterValue = options.type === FilterType.Text ? `%${value}%` : value;
    searchParameters.set(field, filterValue);
  }
  return searchParameters;
};

export async function fetchResources<T extends Resource>(
  resource: T,
  page = 1,
  {
    sortDirection = SORT_FILTER_DEFAULT_VALUES.sortDirection,
    sortBy = SORT_FILTER_DEFAULT_VALUES.sortBy,
    filters = SORT_FILTER_DEFAULT_VALUES.filters,
  }: Partial<SortFiltersFormValues> = {},
  filterDefinitions: FilterDefinitions = {},
): Promise<GetResourcesResponse<T>> {
  const sort = `${sortDirection === SortDirection.Ascending ? "+" : "-"}${sortBy ?? "order"}`;

  const search = sanitizeFilteredFields(filterDefinitions, filters);
  search.set("page", String(page));
  search.set("limit", String(LIST_RESULTS_PER_PAGE));
  search.set("sort", sort);

  const searchString = `?${search.toString()}`;

  try {
    const result = await fetchQuery<GetResourcesResponse<T>>(searchString, {
      resource,
    });
    return result;
  } catch (error) {
    if (error instanceof FetchError) {
      console.error(error.errorReport);
    }
    throw error;
  }
}
