/** This file contains interfaces of responses returned by the API. */
import type { User } from "@/features/authentication/types";
import type { Resource } from "@/features/resources";
import type {
  ResourceDataType,
  ResourceDataWithRelations,
} from "@/features/resources/types";

import type { DatedResource, MessageResponse, PaginationMetadata } from "./api";

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
