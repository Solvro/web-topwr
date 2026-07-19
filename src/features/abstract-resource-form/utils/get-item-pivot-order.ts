import type { ItemWithPivotOrder } from "../types/internal";

export const hasMeta = (
  item: unknown,
): item is { meta: Record<string, unknown> } =>
  typeof item === "object" &&
  item !== null &&
  "meta" in item &&
  typeof item.meta === "object" &&
  item.meta !== null;

export const hasPivotOrder = (item: unknown): item is ItemWithPivotOrder =>
  hasMeta(item) && "pivot_order" in item.meta;

export const getItemPivotOrder = (item: unknown): number | undefined => {
  if (hasPivotOrder(item) && typeof item.meta.pivot_order === "number") {
    return item.meta.pivot_order;
  }

  return undefined;
};
