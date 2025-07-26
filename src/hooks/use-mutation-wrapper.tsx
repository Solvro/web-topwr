"use client";

import { useMutation } from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

/**
 * A wrapper around the `useMutation` hook from `@tanstack/react-query` to simplify its usage.
 *
 * @template TData - The type of the data returned by the mutation.
 * @template TBody - The type of the variables passed to the mutation function.
 * @template TError - The type of the error returned by the mutation. Defaults to `never`.
 *
 * @param {string} mutationKey - A unique key for the mutation.
 * @param {(variables: TBody) => Promise<TData>} mutationFunction - A function that performs the mutation.
 * @param {Omit<UseMutationOptions<TData, TError, TBody>, "mutationKey" | "mutationFn">} [options] - Optional configuration for the mutation, excluding `mutationKey` and `mutationFn`.
 *
 * @returns {UseMutationResult<TData, TError, TBody>} The result of the mutation, including mutate function, status, and error.
 */
export function useMutationWrapper<TData, TBody, TError = never>(
  mutationKey: string,
  mutationFunction: (body: TBody) => Promise<TData>,
  options?: Omit<
    UseMutationOptions<TData, TError, TBody>,
    "mutationKey" | "mutationFn"
  >,
): UseMutationResult<TData, TError, TBody> {
  return useMutation<TData, TError, TBody>({
    mutationFn: mutationFunction,
    mutationKey: [mutationKey],
    ...options,
  });
}
