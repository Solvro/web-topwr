import type { FetchError } from "./fetch-utils";

const ERROR_MESSAGES: Record<string, string> = {
  E_INVALID_CREDENTIALS: "Wpisano niepoprawny email lub hasło",
  E_UNEXPECTED_ERROR: "Nastąpił nieoczekiwany błąd",
  E_VALIDATION_ERROR: "Wpisane dane są niekompletne lub nieprawidłowe",
};

const isFetchError = (error: Error): error is FetchError =>
  (error as FetchError).errorReport != null;

function getCodedMessage(code: string, fallback: string): string {
  if (code in ERROR_MESSAGES) {
    return ERROR_MESSAGES[code];
  }
  console.warn(
    `Unhandled error code: ${code}. Please add it to src/error-handling.ts#ERROR_MESSAGES with a user-friendly error message.`,
  );
  return fallback;
}

export function getErrorMessage(
  error: unknown,
  fallback: string = ERROR_MESSAGES.E_UNEXPECTED_ERROR,
): string {
  if (error == null || !(error instanceof Error)) {
    return fallback;
  }
  if (isFetchError(error)) {
    const code = error.errorReport?.error.code;
    return code == null ? error.message : getCodedMessage(code, fallback);
  }
  return fallback;
}
