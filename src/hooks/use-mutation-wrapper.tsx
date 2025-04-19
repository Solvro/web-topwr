"use client";

import { useMutation } from "@tanstack/react-query";
import type { MutationOptions } from "@tanstack/react-query";

export function useMutationWrapper<TData, TError>(
  mutationKey: string,
  mutationFunction: Promise<TData>,
  options?: Omit<MutationOptions<TData, TError>, "mutationKey" | "mutationFn">,
) {
  return useMutation<TData, TError>({
    mutationFn: async () => await mutationFunction,
    mutationKey: [mutationKey, mutationFunction],
    ...options,
  });
}
