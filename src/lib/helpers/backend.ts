import { LIST_RESULTS_PER_PAGE } from "@/config/constants";
import type { Resource } from "@/config/enums";
import { fetchQuery } from "@/lib/fetch-utils";
import { encodeQueryComponent } from "@/lib/helpers";
import type { GetResourcesResponse } from "@/types/api";
import type { ListSearchParameters } from "@/types/components";

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

export async function fetchResources<T extends Resource>(
  resource: T,
  page = 1,
  searchParameters: ListSearchParameters = {},
): Promise<GetResourcesResponse<T>> {
  const sortBy = searchParameters.sortBy ?? "order";
  const sortDirection = searchParameters.sortDirection === "desc" ? "-" : "+";
  const searchField = searchParameters.searchField;
  const searchTerm = searchParameters.searchTerm;

  const search =
    searchField == null || searchTerm == null
      ? ""
      : `${encodeQueryComponent(searchField)}=%${encodeQueryComponent(searchTerm)}%&`;
  const result = await fetchQuery<GetResourcesResponse<T>>(
    `?${search}page=${String(page)}&limit=${String(LIST_RESULTS_PER_PAGE)}&sort=${sortDirection}${sortBy}`,
    { resource },
  );
  return result;
}
