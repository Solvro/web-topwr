import type { Resource } from "@/config/enums";
import { ORDERABLE_RESOURCES } from "@/config/resources";
import type { OrderableResource } from "@/types/app";
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

export const isOrderableResource = (
  resource: Resource,
): resource is OrderableResource =>
  ORDERABLE_RESOURCES.includes(resource as OrderableResource);
