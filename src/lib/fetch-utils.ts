import { API_URL } from "@/config/constants";
import { getAuthState } from "@/stores/auth";
import type { ErrorResponse, SuccessResponse } from "@/types/api";

type RequestOptions = {
  headers?: Record<string, string>;
  accessTokenOverride?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
} & Omit<RequestInit, "headers" | "method" | "body">;

const isAbsolutePath = (url: string) => /^https?:\/\//.test(url);

export class FetchError extends Error {
  public errorReport: ErrorResponse | null;

  constructor(message: string, errorReport: ErrorResponse | null = null) {
    super(message);
    this.errorReport = errorReport;

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
    // console.error("Error response body:", JSON.stringify(errorReport, null, 2));

    throw new FetchError(
      `Error ${String(response.status)}: ${response.statusText}`,
      errorReport,
    );
  }

  return responseBody;
}

const getAccessToken = () => getAuthState()?.token;

function createRequest(
  endpoint: string,
  { accessTokenOverride, ...options }: RequestOptions & { body?: unknown },
): Request {
  const url = isAbsolutePath(endpoint)
    ? endpoint
    : `${API_URL}/${endpoint.replace(/^\/+/, "")}`;

  const token = accessTokenOverride ?? getAccessToken();

  if (token != null && typeof token === "string") {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  if (options.body != null && typeof options.body !== "string") {
    options.body = JSON.stringify(options.body);
  }
  return new Request(url, options as RequestOptions & { body?: string });
}

export async function fetchQuery<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<NonNullable<T>> {
  const response = await fetch(
    createRequest(endpoint, {
      ...options,
      method: "GET",
      next: { revalidate: 60 },
    }),
  );
  return handleResponse<T>(response);
}

export async function fetchMutation<T>(
  endpoint: string,
  body: unknown,
  options: RequestOptions = {},
): Promise<NonNullable<T>> {
  const method = options.method ?? "POST";
  options.headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  const response = await fetch(
    createRequest(endpoint, { ...options, method, body }),
  );
  return handleResponse<T>(response);
}
