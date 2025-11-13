import { FetchError } from "../lib/fetch-error";
import type { ErrorResponse, SuccessResponse } from "../types/api";

export async function handleResponse<T>(
  response: Response,
): Promise<NonNullable<T>> {
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
