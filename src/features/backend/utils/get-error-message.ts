import { API_ERROR_MESSAGES } from "../data/api-error-messages";
import { FetchError } from "../lib/fetch-error";

export const getErrorMessage = (
  error: unknown,
  fallback: string = API_ERROR_MESSAGES.E_UNEXPECTED_ERROR,
): string =>
  error instanceof FetchError ? error.getCodedMessage(fallback) : fallback;
