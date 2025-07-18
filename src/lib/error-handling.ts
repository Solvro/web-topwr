import { API_ERROR_MESSAGES } from "@/config/constants";

import { FetchError } from "./fetch-utils";

function getCodedMessage(code: string, fallback: string): string {
  if (code in API_ERROR_MESSAGES) {
    return API_ERROR_MESSAGES[code];
  }
  console.warn(
    `Unhandled error code: ${code}. Please add it to @/config/constants.ts#API_ERROR_MESSAGES with a user-friendly error message.`,
  );
  return fallback;
}

export function getErrorMessage(
  error: unknown,
  fallback: string = API_ERROR_MESSAGES.E_UNEXPECTED_ERROR,
): string {
  if (error instanceof FetchError) {
    const code = error.errorReport?.error.code;
    return code == null ? error.message : getCodedMessage(code, fallback);
  }
  return fallback;
}
