import type { Resource } from "@/features/resources";
import { removeLeadingSlash } from "@/lib/helpers";

import type { FetchRequestOptions } from "../types/internal";
import { getAccessToken } from "../utils/get-access-token";
import { getRelationQueryParameters } from "../utils/get-relation-query-parameters";
import { getResourceApiBase } from "../utils/get-resource-api-base";
import { getResourceEndpointPrefix } from "../utils/get-resource-endpoint-prefix";
import { isAbsolutePath } from "../utils/is-absolute-path";

export function createRequest<T extends Resource>(
  endpoint: string,
  {
    accessTokenOverride,
    resource,
    body,
    includeRelations = false,
    ...options
  }: FetchRequestOptions<T>,
): Request {
  function setHeader(key: string, value?: string) {
    if (value == null) {
      delete options.headers?.[key];
      return;
    }
    options.headers = {
      ...options.headers,
      [key]: value,
    };
  }

  const endpointPrefix = getResourceEndpointPrefix(resource);
  const queryParameters = getRelationQueryParameters(
    resource,
    includeRelations,
  );
  const url = isAbsolutePath(endpoint)
    ? endpoint
    : `${getResourceApiBase(resource)}/${endpointPrefix}${removeLeadingSlash(endpoint)}${queryParameters}`;

  const token = accessTokenOverride ?? getAccessToken();
  const isMultipart = body instanceof FormData;
  if (isMultipart) {
    // This resolves a 400 response from the API
    // https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    setHeader("Content-Type");
  }

  if (token != null && typeof token === "string") {
    setHeader("Authorization", `Bearer ${token}`);
  }
  const requestInit: RequestInit = options;

  if (body != null && typeof body !== "string") {
    requestInit.body = isMultipart ? body : JSON.stringify(body);
  }
  return new Request(url, requestInit);
}
