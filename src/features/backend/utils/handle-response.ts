import { logger, parseError } from "@/features/logging";

import { FetchError } from "../lib/fetch-error";
import type { ErrorResponse, SuccessResponse } from "../types/api";

export async function handleResponse<T>(
  request: Request,
  response: Response,
): Promise<NonNullable<T>> {
  let responseBody = null;

  try {
    responseBody = (await response.json()) as T;
  } catch (error) {
    logger.warn(parseError(error), "Could not parse the response body as JSON");
  }

  const errorResponseBody = responseBody as ErrorResponse | SuccessResponse<T>;

  if (
    !response.ok ||
    responseBody == null ||
    ("success" in errorResponseBody && errorResponseBody.success !== true)
  ) {
    const errorReport = responseBody as ErrorResponse | null;
    const { message, ...error } = errorReport?.error ?? {
      message: "<no error report provided>",
    };
    logger.error(
      { url: request.url, method: request.method, ...error },
      `Request failed with ${message}`,
    );

    throw new FetchError(
      `HTTP ${String(response.status)} (${response.statusText}): ${errorReport?.error.code ?? "<unknown code>"}`,
      errorReport,
      response.status,
    );
  }

  return responseBody;
}
