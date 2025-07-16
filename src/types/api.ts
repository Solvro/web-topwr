// Types Source: backend-topwr
export interface MessageResponse {
  message: string;
}

export interface SerializedErrorReport {
  /**
   * Message of the top-level error
   */
  message: string;
  /**
   * Most recently set error code in the error stack
   *
   * This value is derived by traversing the error stack, from the top-level error, down the error cause chain.
   * The first `code` field defined on an error becomes the value of this property.
   * 'E_UNEXPECTED_ERROR' is used if no error in the error cause chain defines a `code` property.
   */
  code: string;
  /**
   * List of validation errors for 'E_VALIDATION_ERROR' errors.
   */
  validationIssues?: MessageResponse[];
  /**
   * Error message of each error cause in the error stack, ordered from top to bottom of the stack
   *
   * Includes the top-level error message as the first item.
   * Will be undefined if the first error in the stack that defines a `sensitive` property has it set to `true`.
   * This is intended to be used for errors that should intentionally be left opaque for security purposes, such as errors from auth endpoints.
   * "Sensitive" errors will still be fully logged.
   */
  causeStack?: string[];
  /**
   * Stack trace of the deepest error in the cause stack (the root error cause)
   *
   * Not available in production.
   */
  rootStackTrace?: string[];
}

export interface ErrorResponse {
  success?: false;
  error: SerializedErrorReport;
}

export type SuccessResponse<T> = T & { success: boolean };

/** As returned from GET /auth/me */
export interface User {
  id: number;
  fullName: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
}

/** As returned from POST /auth/login */
export interface AuthState {
  user: User;
  token: string;
}
