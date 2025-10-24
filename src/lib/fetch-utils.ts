import type { Resource } from "@/config/enums";
import { env } from "@/config/env";
import { getAuthState } from "@/stores/auth";
import type { ErrorResponse, SuccessResponse } from "@/types/api";

import { removeLeadingSlash } from "./helpers";
import { getRecursiveRelations, getResourceMetadata } from "./helpers/app";

interface BaseRequestOptions<T extends Resource>
  extends Omit<RequestInit, "headers" | "method" | "body"> {
  headers?: Record<string, string>;
  accessTokenOverride?: string;
  resource?: T;
}
interface QueryRequestOptions<T extends Resource>
  extends BaseRequestOptions<T> {
  method?: "GET";
  body?: never;
  includeRelations?: boolean;
}

interface MutationRequestOptions<T extends Resource>
  extends BaseRequestOptions<T> {
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  includeRelations?: never;
}

type FetchRequestOptions<T extends Resource> =
  | QueryRequestOptions<T>
  | MutationRequestOptions<T>;

const isAbsolutePath = (url: string) => /^https?:\/\//.test(url);

export class FetchError extends Error {
  public errorReport: ErrorResponse | null;
  public responseStatus: number;

  constructor(
    message: string,
    errorReport: ErrorResponse | null = null,
    responseStatus: number,
  ) {
    super(message);
    this.errorReport = errorReport;
    this.responseStatus = responseStatus;

    // Adjust the stack trace to remove this constructor
    if (typeof this.stack === "string" && this.stack.trim() !== "") {
      const stackLines = this.stack.split("\n");
      this.stack = [stackLines[0], ...stackLines.slice(2)].join("\n");
    }
  }
}

async function handleResponse<T>(response: Response): Promise<NonNullable<T>> {
  let responseBody = null;

  try {
    responseBody = (await response.json()) as T;
  } catch (error) {
    console.warn("Could not parse the response body as JSON", error);
  }

  const errorResponseBody = responseBody as ErrorResponse | SuccessResponse<T>;

  if (
    !response.ok ||
    responseBody == null ||
    ("success" in errorResponseBody && errorResponseBody.success !== true)
  ) {
    const errorReport = responseBody as ErrorResponse | null;

    throw new FetchError(
      `Error ${String(response.status)}: ${response.statusText}`,
      errorReport,
      response.status,
    );
  }

  return responseBody;
}

const getAccessToken = () => getAuthState()?.accessToken;

const getResourceEndpointPrefix = (resource: Resource | undefined) =>
  resource == null ? "" : `${getResourceMetadata(resource).apiPath}/`;

function getRelationQueryParameters(
  resource: Resource | undefined,
  includeRelations: boolean,
): string {
  if (resource == null || !includeRelations) {
    return "";
  }
  const relationSearchParameters = Object.fromEntries(
    getRecursiveRelations(resource).map((relation) => [relation, "true"]),
  );
  return `?${new URLSearchParams(relationSearchParameters).toString()}`;
}

function createRequest<T extends Resource>(
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
    : `${env.NEXT_PUBLIC_API_URL}/${endpointPrefix}${removeLeadingSlash(endpoint)}${queryParameters}`;

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

/** Prepares, sends and handles a fetch request based on the provided options. */
const executeFetch = async <T, R extends Resource>(
  endpoint: string,
  options: FetchRequestOptions<R>,
): Promise<NonNullable<T>> =>
  handleResponse<T>(await fetch(createRequest(endpoint, options)));

/** Performs a cached GET request on the API. */
export const fetchQuery = async <T, R extends Resource = Resource>(
  endpoint: string,
  options: QueryRequestOptions<R> = {},
): Promise<NonNullable<T>> =>
  executeFetch(endpoint, {
    next: { revalidate: 60 },
    ...options,
    method: "GET",
  });

/** Performs a non-GET request on the API. */
export const fetchMutation = async <T, R extends Resource = Resource>(
  endpoint: string,
  options: MutationRequestOptions<R> = {},
): Promise<NonNullable<T>> =>
  executeFetch(endpoint, {
    method: "POST",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
