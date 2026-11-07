import { animate, useMotionValueEvent, useScroll } from "motion/react";
import type { AnimationPlaybackControls } from "motion/react";
import { useRef, useState } from "react";
import type { PointerEvent } from "react";

import { TIMELINE_ITEM_WIDTH } from "../constants";

const SCROLL_EDGE_THRESHOLD = 0.01;
const MIN_GLIDE_DURATION = 0.4;
const MAX_GLIDE_DURATION = 1.2;
/** Glide distance (px) covered per second of animation, used to scale its duration */
const GLIDE_DISTANCE_PER_SECOND = 1200;
/** How many seconds of release velocity are added to the final scroll position */
const MOMENTUM_PROJECTION_SECONDS = 0.35;
/** Pointer samples older than this at release are treated as a stop, not a flick */
const MOMENTUM_SAMPLE_MAX_AGE_MS = 80;
const GLIDE_EASE = [0.16, 1, 0.3, 1] as const;

interface PointerSample {
  pointerX: number;
  time: number;
}

export function useTimelineScroll() {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const dragStartRef = useRef<{ pointerX: number; scrollLeft: number }>(null);
  const glideAnimationRef = useRef<AnimationPlaybackControls>(null);
  const pointerSamplesRef = useRef<PointerSample[]>([]);
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

  const getReleaseScrollVelocity = (releaseTime: number) => {
    const samples = pointerSamplesRef.current;
    const lastSample = samples.at(-1);
    const firstSample = samples.at(0);
    if (
      lastSample === undefined ||
      firstSample === undefined ||
      lastSample === firstSample ||
      releaseTime - lastSample.time > MOMENTUM_SAMPLE_MAX_AGE_MS
    ) {
      return 0;
    }
    const elapsedSeconds = (lastSample.time - firstSample.time) / 1000;
    return -(lastSample.pointerX - firstSample.pointerX) / elapsedSeconds;
  };

  const glideWithMomentum = (
    scrollContainer: HTMLUListElement,
    scrollVelocity: number,
  ) => {
    const maxScrollLeft =
      scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const targetScrollLeft = Math.min(
      Math.max(
        scrollContainer.scrollLeft +
          scrollVelocity * MOMENTUM_PROJECTION_SECONDS,
        0,
      ),
      maxScrollLeft,
    );
    const glideDistance = Math.abs(
      targetScrollLeft - scrollContainer.scrollLeft,
    );
    if (glideDistance < 1) {
      setIsDragging(false);
      return;
    }

    glideAnimationRef.current = animate(
      scrollContainer.scrollLeft,
      targetScrollLeft,
      {
        duration: Math.min(
          Math.max(
            MIN_GLIDE_DURATION,
            glideDistance / GLIDE_DISTANCE_PER_SECOND,
          ),
          MAX_GLIDE_DURATION,
        ),
        ease: GLIDE_EASE,
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
    glideAnimationRef.current?.stop();
    dragStartRef.current = {
      pointerX: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
    };
    pointerSamplesRef.current = [
      { pointerX: event.clientX, time: event.timeStamp },
    ];
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
    pointerSamplesRef.current = [
      ...pointerSamplesRef.current.filter(
        (sample) => event.timeStamp - sample.time <= MOMENTUM_SAMPLE_MAX_AGE_MS,
      ),
      { pointerX: event.clientX, time: event.timeStamp },
    ];
  };

  const stopDragging = (event: PointerEvent<HTMLUListElement>) => {
    if (dragStartRef.current == null) {
      return;
    }
    dragStartRef.current = null;
    glideWithMomentum(
      event.currentTarget,
      getReleaseScrollVelocity(event.timeStamp),
    );
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
