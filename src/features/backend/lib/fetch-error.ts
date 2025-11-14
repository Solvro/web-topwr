import { API_ERROR_MESSAGES } from "../data/api-error-messages";
import type { ErrorResponse } from "../types/api";

export class FetchError extends Error {
  public errorReport: ErrorResponse | null;
  public responseStatus: number;

  constructor(
    message: string,
    errorReport: ErrorResponse | null = null,
    responseStatus: number,
  ) {
    super(message);
    this.errorReport = errorReport;
    this.responseStatus = responseStatus;

    // Adjust the stack trace to remove this constructor
    if (typeof this.stack === "string" && this.stack.trim() !== "") {
      const stackLines = this.stack.split("\n");
      this.stack = [stackLines[0], ...stackLines.slice(2)].join("\n");
    }
  }

  getCodedMessage(fallback: string): string {
    const code = this.errorReport?.error.code;
    if (code == null) {
      return this.message;
    }
    if (code in API_ERROR_MESSAGES) {
      return API_ERROR_MESSAGES[code];
    }
    console.warn(
      `Unhandled error code: ${code}. Please add it to @/features/backend/data/api-error-messages.ts with a user-friendly error message.`,
    );
    return fallback;
  }
}
