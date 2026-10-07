import { animate, useMotionValueEvent, useScroll } from "motion/react";
import type { AnimationPlaybackControls } from "motion/react";
import { useRef, useState } from "react";
import type { PointerEvent } from "react";

import { TIMELINE_ITEM_WIDTH } from "../constants";

const SCROLL_EDGE_THRESHOLD = 0.01;
const SNAP_ANIMATION_DURATION = 0.3;

export function useTimelineScroll() {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const dragStartRef = useRef<{ pointerX: number; scrollLeft: number }>(null);
  const snapAnimationRef = useRef<AnimationPlaybackControls>(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
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

  const snapToNearestItem = (scrollContainer: HTMLUListElement) => {
    const maxScrollLeft =
      scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const nearestItemScrollLeft =
      Math.round(scrollContainer.scrollLeft / TIMELINE_ITEM_WIDTH) *
      TIMELINE_ITEM_WIDTH;

    snapAnimationRef.current = animate(
      scrollContainer.scrollLeft,
      Math.min(nearestItemScrollLeft, maxScrollLeft),
      {
        duration: SNAP_ANIMATION_DURATION,
        ease: "easeOut",
        onUpdate: (scrollLeft) => {
          scrollContainer.scrollLeft = scrollLeft;
        },
        onComplete: () => {
          setIsDragging(false);
        },
      },
    );
  };

  const startDragging = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }
    snapAnimationRef.current?.stop();
    dragStartRef.current = {
      pointerX: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const drag = (event: PointerEvent<HTMLUListElement>) => {
    const dragStart = dragStartRef.current;
    if (dragStart == null) {
      return;
    }
    event.currentTarget.scrollLeft =
      dragStart.scrollLeft - (event.clientX - dragStart.pointerX);
  };

  const stopDragging = (event: PointerEvent<HTMLUListElement>) => {
    if (dragStartRef.current == null) {
      return;
    }
    dragStartRef.current = null;
    snapToNearestItem(event.currentTarget);
  };

  return {
    scrollContainerRef,
    canScrollPrevious,
    canScrollNext,
    scrollTimeline,
    isDragging,
    dragHandlers: {
      onPointerDown: startDragging,
      onPointerMove: drag,
      onPointerUp: stopDragging,
      onPointerCancel: stopDragging,
    },
  };
}
