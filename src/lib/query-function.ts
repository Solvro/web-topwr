"use client";

import { QueryOptions, useQuery } from "@tanstack/react-query";

export function queryFnWrapper<TData, TError>(
  queryKey: string | string[],
  queryFn: Promise<TData>,
  options?: Omit<QueryOptions<TData, TError>, "queryKey" | "queryFn">,
) {
  return useQuery<TData, TError>({
    queryFn: () => queryFn,
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    ...options,
  });
}
