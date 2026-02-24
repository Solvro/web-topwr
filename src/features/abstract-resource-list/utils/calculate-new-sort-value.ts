import type {
  OrderableResource,
  ResourceDataType,
} from "@/features/resources/types";

/**
 * Given the indices of an item's old and new position, calculate its new sort value using the average of its neighbours' sort values.
 */
export function calculateNewSortValue(
  items: ResourceDataType<OrderableResource>[],
  oldIndex: number,
  newIndex: number,
): number {
  if (newIndex === 0) {
    return items[0].order - 1;
  }
  if (newIndex === items.length - 1) {
    // arbitrary large-ish number which facilitates inserting new items, 64 is a power of 2 so easy to halve
    const lastItem = items.at(-1);
    return lastItem == null ? 64 : lastItem.order + 1;
  }
  const first = items[newIndex];
  const second =
    oldIndex < newIndex ? items[newIndex + 1] : items[newIndex - 1];
  return (first.order + second.order) / 2;
}
