import type { Resource } from "@/features/resources";

interface BaseRequestOptions<T extends Resource>
  extends Omit<RequestInit, "headers" | "method" | "body"> {
  headers?: Record<string, string>;
  accessTokenOverride?: string;
  resource?: T;
}
export interface QueryRequestOptions<T extends Resource>
  extends BaseRequestOptions<T> {
  method?: "GET";
  body?: never;
  includeRelations?: boolean;
}

export interface MutationRequestOptions<T extends Resource>
  extends BaseRequestOptions<T> {
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  includeRelations?: never;
}

export type FetchRequestOptions<T extends Resource> =
  | QueryRequestOptions<T>
  | MutationRequestOptions<T>;
