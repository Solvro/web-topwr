import type { Resource } from "@/config/enums";
import { ORDERABLE_RESOURCES } from "@/config/resources";
import type { OrderableResource } from "@/types/app";

export function typedEntries<T extends Record<string, unknown> | unknown[]>(
  targetObject: T,
): [keyof T, T[keyof T]][] {
  return Object.entries(targetObject) as [keyof T, T[keyof T]][];
}

export const isOrderableResource = (
  resource: Resource,
): resource is OrderableResource =>
  ORDERABLE_RESOURCES.includes(resource as OrderableResource);
