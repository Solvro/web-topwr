import { logger, parseError } from "@/features/logging";
import type { Resource } from "@/features/resources";

import { createRequest } from "../lib/create-request";
import type { FetchRequestOptions } from "../types/internal";
import { handleResponse } from "./handle-response";

/** Prepares, sends and handles a fetch request based on the provided options. */
export const executeFetch = async <T, R extends Resource>(
  endpoint: string,
  options: FetchRequestOptions<R>,
): Promise<NonNullable<T>> => {
  const request = createRequest<R>(endpoint, options);
  let response;
  try {
    response = await fetch(request);
  } catch (error) {
    logger.error(parseError(error), "Network error during fetch request");
    throw error;
  }
  return await handleResponse<T>(request, response);
};
