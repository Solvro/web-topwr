import { useEffect, useRef, useState } from "react";

import type { Contributor, HoveredItemInfo } from "../types";

/**
 * Manages hover state and tooltip positioning for contributor avatars.
 *
 * @param contributors - The list of contributors.
 * @returns An object containing the hover state, element refs, and hover event handlers.
 */
export function useContributorHover(contributors: Contributor[]) {
  const [hoveredItemInfo, setHoveredItemInfo] =
    useState<HoveredItemInfo | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseEnter = (index: number) => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
    }

    const element = itemsRef.current[index];
    let x = 0;
    let y = 0;
    let rowStart = index;
    let rowEnd = index;

    if (element?.parentElement != null) {
      const wrapper = element.parentElement;
      x = wrapper.offsetLeft + wrapper.offsetWidth / 2;
      y = wrapper.offsetTop;

      const targetOffsetTop = wrapper.offsetTop;

      for (let searchIndex = index - 1; searchIndex >= 0; searchIndex--) {
        const siblingElement = itemsRef.current[searchIndex]?.parentElement;
        if (siblingElement?.offsetTop === targetOffsetTop) {
          rowStart = searchIndex;
        } else {
          break;
        }
      }

      for (
        let searchIndex = index + 1;
        searchIndex < contributors.length;
        searchIndex++
      ) {
        const siblingElement = itemsRef.current[searchIndex]?.parentElement;
        if (siblingElement?.offsetTop === targetOffsetTop) {
          rowEnd = searchIndex;
        } else {
          break;
        }
      }
    }

    setHoveredItemInfo({
      index,
      rowStart,
      rowEnd,
      x,
      y,
    });
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredItemInfo(null);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { hoveredItemInfo, itemsRef, handleMouseEnter, handleMouseLeave };
}
