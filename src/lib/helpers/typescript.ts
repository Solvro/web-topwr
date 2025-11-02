import { SortDirection } from "@/config/enums";
import type { ValueOf } from "@/types/helpers";

type EnumerableObject = Record<string, unknown> | unknown[];

export const typedKeys = <T extends EnumerableObject>(
  targetObject: T,
): (keyof T)[] => Object.keys(targetObject) as (keyof T)[];

export const typedEntries = <T extends EnumerableObject>(
  targetObject: T,
): [keyof T, ValueOf<T>][] =>
  Object.entries(targetObject) as [keyof T, ValueOf<T>][];

export const typedFromEntries = <T extends EnumerableObject>(
  entries: [keyof T, ValueOf<T>][],
): T => Object.fromEntries(entries) as T;

/** Checks if a value is empty (null, undefined, or whitespace). */
export const isEmptyValue = (value: unknown): value is "" | null | undefined =>
  value == null || (typeof value === "string" && value.trim() === "");

export const isUnsetEnumField = (value: unknown): boolean =>
  value == null || Number(value) < 0;

export const isValidSortDirection = (value: unknown): value is SortDirection =>
  value === SortDirection.Ascending || value === SortDirection.Descending;
