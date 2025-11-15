import { logger } from "@/features/logging";

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
  }

  getCodedMessage(fallback: string): string {
    const code = this.errorReport?.error.code;
    if (code == null) {
      return this.message;
    }
    if (code in API_ERROR_MESSAGES) {
      return API_ERROR_MESSAGES[code];
    }
    logger.warn(
      { unhandledCode: code },
      `Unhandled error code. Please add it to @/features/backend/data/api-error-messages.ts with a user-friendly error message.`,
    );
    return fallback;
  }
}
