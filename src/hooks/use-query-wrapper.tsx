"use client";

import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "@tanstack/react-query";

export function useQueryWrapper<TData, TError>(
  queryKey: string,
  queryFunction: Promise<TData>,
  options?: Omit<QueryOptions<TData, TError>, "queryKey" | "queryFn">,
) {
  return useQuery<TData, TError>({
    queryFn: async () => await queryFunction,
    queryKey: [queryKey, queryFunction],
    ...options,
  });
}
