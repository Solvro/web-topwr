import { useRef, useSyncExternalStore } from "react";

import {
  ITEM_EFFECTIVE_WIDTH,
  ITEM_OVERLAP,
  MIN_ITEMS_PER_ROW,
} from "../constants";
import type { Contributor } from "../types";

const SSR_MAX_PER_ROW = 100;

function calculateOptimalRowSize(totalItems: number, maxPerRow: number) {
  if (totalItems <= maxPerRow) {
    return totalItems;
  }

  let optimalRowSize = maxPerRow;
  for (
    let candidateRowSize = maxPerRow;
    candidateRowSize >= MIN_ITEMS_PER_ROW;
    candidateRowSize--
  ) {
    const remainder = totalItems % candidateRowSize;
    if (remainder === 0 || remainder >= MIN_ITEMS_PER_ROW) {
      optimalRowSize = candidateRowSize;
      break;
    }
  }

  if (
    optimalRowSize === maxPerRow &&
    totalItems % maxPerRow !== 0 &&
    totalItems % maxPerRow < MIN_ITEMS_PER_ROW
  ) {
    const minRows = Math.ceil(totalItems / maxPerRow);
    optimalRowSize = Math.ceil(totalItems / minRows);
  }

  return optimalRowSize;
}

function chunkIntoRows<T>(items: T[], rowSize: number) {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += rowSize) {
    rows.push(items.slice(index, index + rowSize));
  }
  return rows;
}

function useMaxItemsPerRow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const maxPerRowRef = useRef(SSR_MAX_PER_ROW);

  const subscribe = (onStoreChange: () => void) => {
    const element = containerRef.current;

    const observer =
      element == null
        ? null
        : new ResizeObserver((entries) => {
            let changed = false;
            for (const entry of entries) {
              const width = entry.contentRect.width;

              let calculatedMax = Math.floor(
                (width - ITEM_OVERLAP) / ITEM_EFFECTIVE_WIDTH,
              );
              if (calculatedMax < 1) {
                calculatedMax = 1;
              }

              if (maxPerRowRef.current !== calculatedMax) {
                maxPerRowRef.current = calculatedMax;
                changed = true;
              }
            }
            if (changed) {
              onStoreChange();
            }
          });

    if (element != null && observer != null) {
      observer.observe(element);
    }

    return () => {
      observer?.disconnect();
    };
  };
  const getSnapshot = () => maxPerRowRef.current;
  const getSSRMaxPerRow = () => SSR_MAX_PER_ROW;

  const maxPerRow = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSSRMaxPerRow,
  );

  return { containerRef, maxPerRow };
}

/**
 * Dynamically chunks the contributors array into visually balanced rows based on container width.
 * Prevents lonely items on the last row.
 *
 * @param contributors - Array of contributors to chunk.
 * @returns The container ref, the chunked rows, and the computed row size.
 */
export function useContributorRows(contributors: Contributor[]) {
  const { containerRef, maxPerRow } = useMaxItemsPerRow();
  const rowSize = calculateOptimalRowSize(contributors.length, maxPerRow);
  const rows = chunkIntoRows(contributors, rowSize);

  return { containerRef, rows, rowSize };
}
