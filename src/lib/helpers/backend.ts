import { LIST_RESULTS_PER_PAGE } from "@/config/constants";
import { FilterType, SortDirection } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { FetchError, fetchQuery } from "@/lib/fetch-utils";
import { isEmptyValue, typedEntries } from "@/lib/helpers";
import type { GetResourcesResponse } from "@/types/api";
import type { FilterOptions } from "@/types/components";

import { fetchMutation } from "../fetch-utils";

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
export const parseSortParameter = (sortParameter: string | undefined) => {
  if (isEmptyValue(sortParameter)) {
    return null;
  }
  const sortBy = sortParameter.replace(/^[-+]/, "");
  const sortDirection = sortParameter.startsWith("-")
    ? SortDirection.Descending
    : SortDirection.Ascending;
  return { sortBy, sortDirection };
};

/** Converts the client-side search parameters to backend-compatible filters. */
const sanitizeFilterParameters = (
  filterOptions: FilterOptions,
  searchParameters: Record<string, string | undefined>,
) => {
  const filters = new URLSearchParams();
  for (const [key, value] of typedEntries(searchParameters)) {
    if (isEmptyValue(value)) {
      continue;
    }
    if (!(key in filterOptions)) {
      console.warn("Ignoring unknown search parameter", { key, value });
      continue;
    }
    const options = filterOptions[key];
    const filterValue = options.type === FilterType.Text ? `%${value}%` : value;
    filters.set(key, filterValue);
  }
  return filters;
};

export async function fetchResources<T extends Resource>(
  resource: T,
  page = 1,
  allSearchParameters: Record<string, string | undefined> = {},
  filterOptions: FilterOptions = {},
): Promise<GetResourcesResponse<T>> {
  const { sort: sortParameter, ...searchParameters } = allSearchParameters;
  const parsedSort = parseSortParameter(sortParameter);
  const sort =
    parsedSort == null
      ? "+order"
      : `${parsedSort.sortDirection === SortDirection.Ascending ? "+" : "-"}${parsedSort.sortBy}`;

  const filters = sanitizeFilterParameters(filterOptions, searchParameters);

  const filterString = filters.size === 0 ? "" : `${filters}&`;
  const searchString = `?${filterString}page=${String(page)}&limit=${String(LIST_RESULTS_PER_PAGE)}&sort=${sort}`;

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
