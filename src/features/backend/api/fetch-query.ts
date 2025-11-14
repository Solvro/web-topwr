import type { Resource } from "@/features/resources";

import type { QueryRequestOptions } from "../types/internal";
import { executeFetch } from "../utils/execute-fetch";

/** Performs a cached GET request on the API. */
export const fetchQuery = async <T, R extends Resource = Resource>(
  endpoint: string,
  options: QueryRequestOptions<R> = {},
): Promise<NonNullable<T>> =>
  executeFetch(endpoint, {
    next: { revalidate: 60 },
    ...options,
    method: "GET",
  });
