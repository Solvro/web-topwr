"use client";

import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";

/**
 * A wrapper around the `useQuery` hook from `@tanstack/react-query` to simplify its usage.
 *
 * @template TData - The type of the data returned by the query.
 * @template TError - The type of the error returned by the query.
 *
 * @param {string} queryKey - A unique key for the query.
 * @param {() => Promise<TData>} queryFunction - A function that resolves the query data.
 * @param {Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">} [options] - Optional configuration for the query, excluding `queryKey` and `queryFn`.
 *
 * @returns {UseQueryResult<TData, TError>} The result of the query, including data, status, and error.
 */
export function useQueryWrapper<TData, TError>(
  queryKey: string,
  queryFunction: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) {
  return useQuery<TData, TError>({
    queryFn: queryFunction,
    queryKey: [queryKey],
    ...options,
  });
}
