import { logger, parseError } from "@/features/logging";

import { FetchError } from "../lib/fetch-error";
import type { ErrorResponse, SuccessResponse } from "../types/api";

export async function handleResponse<T>(
  request: Request,
  response: Response,
): Promise<NonNullable<T>> {
  let responseBody = null;

  try {
    const responseText = await response.text();
    const text = responseText.trim();
    responseBody = (text ? JSON.parse(text) : {}) as T;
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
      message: "<missing-error-report>",
    };
    const code = errorReport?.error.code ?? String(response.status);
    const errorMessage = `Request failed with code ${code}: ${message}`;
    logger.error(
      {
        url: request.url,
        method: request.method,
        reportMessage: message,
        ...error,
      },
      errorMessage,
    );

    throw new FetchError(errorMessage, errorReport, response.status);
  }

  return responseBody;
}
