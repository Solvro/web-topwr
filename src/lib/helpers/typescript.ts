import {
  NOUN_PHRASE_TRANSFORMATIONS,
  SIMPLE_NOUN_DECLENSIONS,
} from "@/config/polish";
import type { ValueOf } from "@/types/helpers";
import type { DeclinableNoun } from "@/types/polish";

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
  isEmptyValue(value) || Number(value) < 0;

export const isDeclinableNoun = (value: unknown): value is DeclinableNoun =>
  typeof value === "string" &&
  (value in SIMPLE_NOUN_DECLENSIONS || value in NOUN_PHRASE_TRANSFORMATIONS);
