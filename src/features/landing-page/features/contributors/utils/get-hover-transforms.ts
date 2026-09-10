import { ITEM_BASE_WIDTH, MAX_TRANSLATE_Y } from "../constants";
import type { AnimationTransforms, HoveredItemInfo } from "../types";
import { getItemScale } from "./get-item-scale";

/**
 * Calculates the spatial transforms (scale and translation) for a single contributor item.
 * Creates an Apple Dock-style magnification effect by scaling the hovered item and its neighbors,
 * while shifting them outward on the X-axis to prevent overlapping.
 *
 * @param index - The index of the item to calculate transforms for.
 * @param hoveredItemInfo - Information about the currently hovered item, or null if none.
 * @returns An object containing the calculated scale, translateY, translateX, and zIndex.
 */
export const getHoverTransforms = (
  index: number,
  hoveredItemInfo: HoveredItemInfo | null,
): AnimationTransforms => {
  if (hoveredItemInfo == null) {
    return { scale: 1, translateY: 0, translateX: 0, zIndex: index };
  }

  const { index: hoveredIndex, rowStart, rowEnd } = hoveredItemInfo;

  if (index < rowStart || index > rowEnd) {
    return { scale: 1, translateY: 0, translateX: 0, zIndex: index };
  }

  const distance = Math.abs(index - hoveredIndex);
  const scale = getItemScale(distance);
  const translateY = scale > 1 ? -(scale - 1) * MAX_TRANSLATE_Y : 0;
  let translateX = 0;

  if (index !== hoveredIndex) {
    const direction = index < hoveredIndex ? -1 : 1;

    let push = 0;
    push += ((scale - 1) * ITEM_BASE_WIDTH) / 2;
    push += ((getItemScale(0) - 1) * ITEM_BASE_WIDTH) / 2;

    const start = Math.min(index, hoveredIndex) + 1;
    const end = Math.max(index, hoveredIndex) - 1;
    for (let index_ = start; index_ <= end; index_++) {
      const d = Math.abs(index_ - hoveredIndex);
      push += (getItemScale(d) - 1) * ITEM_BASE_WIDTH;
    }

    translateX = direction * push;
  }

  return { scale, translateY, translateX, zIndex: index };
};
