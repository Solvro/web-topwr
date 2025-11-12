import type { User } from "@/features/authentication/types";
import type { Resource } from "@/features/resources";
import type {
  ResourceDataType,
  ResourceDataWithRelations,
} from "@/features/resources/types";

// Types Source: backend-topwr
export interface MessageResponse {
  message: string;
}

interface SerializedErrorReport {
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
  validationIssues?: Record<string, string | undefined>[];
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

export interface DatedResource {
  createdAt: string;
  updatedAt: string;
}

/** As returned from GET /auth/me */
export type GetUserResponse = User; // separating the types in case response signature changes (e.g. { user: { ... } })

/** As returned from POST /auth/login */
export interface LogInResponse {
  type: "bearer";
  accessToken: string;
  refreshToken: string;
  accessExpiresInMs: number;
  refreshExpiresInMs: number;
}

/** As returned from GET /files/{id} */
export interface FileEntry extends DatedResource {
  id: string;
  fileExtension: string;
  url: string;
  miniaturesUrl: string;
}

// API response type from the event_calendar endpoint
export interface ApiCalendarEvent {
  id: string;
  name: string;
  description: string | null;
  startTime: string; // ISO string
  endTime: string; // ISO string
  location: string | null;
  googleCallId: string | null;
}

interface PaginationMetadata {
  total: number;
  perPage: number;
  currentPage: number;
  firstPage: number;
  lastPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

export interface GetResourcesResponse<T extends Resource> {
  data: ResourceDataType<T>[];
}

export interface GetResourcesWithRelationsResponse<T extends Resource> {
  data: ResourceDataWithRelations<T>[];
}

export interface GetResourcesResponsePaginated<T extends Resource> {
  data: ResourceDataType<T>[];
  meta: PaginationMetadata;
}

export interface ModifyResourceResponse<T extends Resource, Data = undefined>
  extends MessageResponse {
  data: Data extends undefined
    ? ResourceDataType<T>
    : ResourceDataType<T> & Data;
}

export interface GetResourceWithRelationsResponse<T extends Resource> {
  data: ResourceDataWithRelations<T>;
}
