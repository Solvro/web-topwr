import { API_URL } from "@/config/constants";
import type { Resource } from "@/config/enums";
import { RESOURCE_METADATA } from "@/config/resources";
import { getAuthState } from "@/stores/auth";
import type { ErrorResponse, SuccessResponse } from "@/types/api";

interface BaseRequestOptions
  extends Omit<RequestInit, "headers" | "method" | "body"> {
  headers?: Record<string, string>;
  accessTokenOverride?: string;
  resource?: Resource;
}
interface QueryRequestOptions extends BaseRequestOptions {
  method?: "GET";
  body?: never;
}

interface MutationRequestOptions extends BaseRequestOptions {
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}

type FetchRequestOptions = QueryRequestOptions | MutationRequestOptions;

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

function createRequest(
  endpoint: string,
  { accessTokenOverride, resource, body, ...options }: FetchRequestOptions,
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

  const url = isAbsolutePath(endpoint)
    ? endpoint
    : `${API_URL}/${resource == null ? "" : `${RESOURCE_METADATA[resource].apiPath}/`}${endpoint.replace(/^\/+/, "")}`;

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
const executeFetch = async <T>(
  endpoint: string,
  options: FetchRequestOptions,
): Promise<NonNullable<T>> =>
  handleResponse<T>(await fetch(createRequest(endpoint, options)));

/** Performs a cached GET request on the API. */
export const fetchQuery = async <T>(
  endpoint: string,
  options: QueryRequestOptions = {},
): Promise<NonNullable<T>> =>
  executeFetch(endpoint, {
    next: { revalidate: 60 },
    ...options,
    method: "GET",
  });

/** Performs a non-GET request on the API. */
export const fetchMutation = async <T>(
  endpoint: string,
  options: MutationRequestOptions = {},
): Promise<NonNullable<T>> =>
  executeFetch(endpoint, {
    method: "POST",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
