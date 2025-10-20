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
