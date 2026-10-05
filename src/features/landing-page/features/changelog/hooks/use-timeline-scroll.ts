import { useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";

import { TIMELINE_ITEM_WIDTH } from "../constants";

const SCROLL_EDGE_THRESHOLD = 0.01;

export function useTimelineScroll() {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const { scrollXProgress } = useScroll({ container: scrollContainerRef });

  useMotionValueEvent(scrollXProgress, "change", (progress) => {
    setCanScrollPrevious(progress > SCROLL_EDGE_THRESHOLD);
    setCanScrollNext(progress < 1 - SCROLL_EDGE_THRESHOLD);
  });

  const scrollTimeline = (direction: "previous" | "next") => {
    scrollContainerRef.current?.scrollBy({
      left: direction === "next" ? TIMELINE_ITEM_WIDTH : -TIMELINE_ITEM_WIDTH,
      behavior: "smooth",
    });
  };

  return {
    scrollContainerRef,
    canScrollPrevious,
    canScrollNext,
    scrollTimeline,
  };
}
