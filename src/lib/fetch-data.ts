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

export async function fetchData<T>(
  endpoint: string,
  options: RequestOptions = {},
  body?: T,
): Promise<SuccessResponse<T> | SerializedErrorReport> {
  const method = options.method ?? "GET";

  if (["POST", "PUT", "PATCH"].includes(method)) {
    // Handle requests that send data to the server
    options.headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Automatically stringify the body if provided
    options.body =
      body !== null && body !== undefined ? JSON.stringify(body) : undefined;
  } else if (method === "GET") {
    // Ensure no body is sent for GET requests
    delete options.body;
  }

  const response = await fetch(
    isAbsolutePath(endpoint)
      ? endpoint
      : `${API_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`,
    {
      ...options,
      next: { revalidate: 60 },
    },
  );

  let responseBody: SuccessResponse<T> | SerializedErrorReport | null = null;

  try {
    responseBody = (await response.json()) as
      | SuccessResponse<T>
      | SerializedErrorReport;
  } catch (error) {
    console.warn("Could not parse the response body as JSON", error);
  }
  //@eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (
    !response.ok ||
    responseBody === null ||
    ("success" in responseBody && !responseBody.success)
  ) {
    const errorReport = responseBody as SerializedErrorReport;
    console.error("Error response body:", JSON.stringify(errorReport, null, 2));
    throw new FetchError(response.statusText, errorReport);
  }

  return responseBody;
}
