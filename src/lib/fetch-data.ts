import { API_URL } from "@/config/api";
import { SerializedErrorReport, SuccessResponse } from "@/lib/types";

type RequestOptions = {
  allowStatus0?: boolean;
  headers?: Record<string, string>;
  body?: BodyInit | null;
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
): Promise<SuccessResponse<T>> {
  const method = options.method ?? "GET";

  if (["POST", "PUT", "PATCH"].includes(method)) {
    // Handle requests that send data to the server
    options.headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Automatically stringify the body if provided
    options.body = body ? JSON.stringify(body) : undefined;
  } else if (method === "GET") {
    // Ensure no body is sent for GET requests
    delete options.body;
  }

  const response = await fetch(
    isAbsolutePath(endpoint) ? endpoint : `${API_URL}/${endpoint}`,
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

  if (!response.ok || !responseBody || "success" in responseBody === false) {
    const errorReport = responseBody as SerializedErrorReport;
    console.error("Error response body:", JSON.stringify(errorReport, null, 2));
    throw new FetchError(response.statusText, errorReport);
  }

  return responseBody;
}
