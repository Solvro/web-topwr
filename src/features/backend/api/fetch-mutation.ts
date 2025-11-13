import type { Resource } from "@/features/resources";

import type { MutationRequestOptions } from "../types/internal";
import { executeFetch } from "../utils/execute-fetch";

/** Performs a non-GET request on the API. */
export const fetchMutation = async <T, R extends Resource = Resource>(
  endpoint: string,
  options: MutationRequestOptions<R> = {},
): Promise<NonNullable<T>> =>
  executeFetch(endpoint, {
    method: "POST",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
