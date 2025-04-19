import { API_URL } from "@/config/api";
import type { SerializedErrorReport, SuccessResponse } from "@/lib/types";

type RequestOptions = {
  headers?: Record<string, string>;
  body?: BodyInit;
} & Omit<RequestInit, "headers">;

const isAbsolutePath = (url: string) => /^https?:\/\//.test(url);

export class FetchError extends Error {
  public errorReport: SerializedErrorReport;

  constructor(message: string, errorReport: SerializedErrorReport) {
    super(message);
    this.errorReport = errorReport;
  }
}

async function handleResponse<T>(
  response: Response,
): Promise<SuccessResponse<T>> {
  let responseBody: SuccessResponse<T> | SerializedErrorReport | null = null;

  try {
    responseBody = (await response.json()) as
      | SuccessResponse<T>
      | SerializedErrorReport;
  } catch (error) {
    console.warn("Could not parse the response body as JSON", error);
  }

  if (
    !response.ok ||
    responseBody === null ||
    ("success" in responseBody && !responseBody.success)
  ) {
    const errorReport = responseBody as SerializedErrorReport;
    console.error("Error response body:", JSON.stringify(errorReport, null, 2));
    throw new FetchError(response.statusText, errorReport);
  }

  return responseBody as SuccessResponse<T>;
}

export async function fetchQuery<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<SuccessResponse<T>> {
  // Ensure no body is sent for GET requests
  delete options.body;

  const response = await fetch(
    isAbsolutePath(endpoint)
      ? endpoint
      : `${API_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`,
    {
      ...options,
      method: "GET",
      next: { revalidate: 60 },
    },
  );

  return handleResponse<T>(response);
}

export async function fetchMutation<T>(
  endpoint: string,
  body: T,
  options: RequestOptions = {},
): Promise<SuccessResponse<T>> {
  const method = options.method ?? "POST";

  if (!["POST", "PUT", "PATCH"].includes(method)) {
    throw new Error(
      `Invalid method "${method}" for fetchMutation. Use POST, PUT, or PATCH.`,
    );
  }

  options.headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  options.body = JSON.stringify(body);

  const response = await fetch(
    isAbsolutePath(endpoint)
      ? endpoint
      : `${API_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`,
    {
      ...options,
      method,
    },
  );

  return handleResponse<T>(response);
}
