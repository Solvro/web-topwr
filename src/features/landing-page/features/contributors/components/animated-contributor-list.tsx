"use client";

import { useInView } from "motion/react";

import { VIEWPORT_OFFSET } from "@/features/landing-page/constants";
import { cn } from "@/lib/utils";

import { ITEM_OVERLAP } from "../constants";
import { useContributorHover } from "../hooks/use-contributor-hover";
import { useContributorRows } from "../hooks/use-contributor-rows";
import type { Contributor } from "../types";
import { getHoverTransforms } from "../utils/get-hover-transforms";
import { AnimatedContributorItem } from "./animated-contributor-item";
import { TooltipOverlay } from "./tooltip-overlay";

export function AnimatedContributorList({
  contributors,
  className = "",
}: {
  contributors: Contributor[];
  className?: string;
}) {
  const { containerRef, rows, rowSize } = useContributorRows(contributors);
  const { hoveredItemInfo, itemsRef, handleMouseEnter, handleMouseLeave } =
    useContributorHover(contributors);
  const isInView = useInView(containerRef, {
    once: true,
    margin: VIEWPORT_OFFSET,
  });

  return (
    <div
      ref={containerRef}
      className={cn(`relative flex w-full flex-col ${className}`)}
      style={{ paddingLeft: ITEM_OVERLAP }}
    >
      {rows.map((row, rowIndex) => (
        <div
          key={row.map((c) => c.id).join("-") || rowIndex}
          className="flex w-full flex-wrap justify-center"
        >
          {row.map((contributor, itemIndexInRow) => {
            const index = rowIndex * rowSize + itemIndexInRow;
            const transforms = getHoverTransforms(index, hoveredItemInfo);

            return (
              <AnimatedContributorItem
                key={contributor.id}
                contributor={contributor}
                index={index}
                transforms={transforms}
                isInView={isInView}
                innerRef={(element) => {
                  itemsRef.current[index] = element;
                }}
                onMouseEnter={() => {
                  handleMouseEnter(index);
                }}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </div>
      ))}

      <TooltipOverlay
        hoveredItemInfo={hoveredItemInfo}
        contributors={contributors}
        onMouseEnter={() => {
          if (hoveredItemInfo != null) {
            handleMouseEnter(hoveredItemInfo.index);
          }
        }}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
}
