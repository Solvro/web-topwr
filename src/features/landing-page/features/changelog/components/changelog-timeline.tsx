"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useTimelineScroll } from "../hooks/use-timeline-scroll";
import type { ChangelogEntry } from "../types";
import { getChangelogVersions } from "../utils/get-changelog-versions";
import { ChangelogTimelineVersion } from "./changelog-timeline-version";

export function ChangelogTimeline({ entries }: { entries: ChangelogEntry[] }) {
  const {
    scrollContainerRef,
    canScrollPrevious,
    canScrollNext,
    scrollTimeline,
    dragHandlers,
  } = useTimelineScroll();

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="relative">
        <ul
          ref={scrollContainerRef}
          {...dragHandlers}
          className={cn(
            "-ml-16 flex cursor-grab scroll-pl-16 overflow-x-auto overflow-y-hidden overscroll-x-contain pl-16 [scrollbar-width:none] active:cursor-grabbing",
            canScrollPrevious && "mask-l-from-[calc(100%-4rem)]",
            canScrollNext && "mask-r-from-85%",
          )}
        >
          {getChangelogVersions(entries).map((version) => (
            <ChangelogTimelineVersion key={version.name} version={version} />
          ))}
        </ul>
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 -left-16 w-16 mask-r-from-0% backdrop-blur-xs transition-opacity",
            !canScrollPrevious && "opacity-0",
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 w-[15%] mask-l-from-0% backdrop-blur-xs transition-opacity",
            !canScrollNext && "opacity-0",
          )}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label="Poprzednie zmiany"
          disabled={!canScrollPrevious}
          onClick={() => {
            scrollTimeline("previous");
          }}
        >
          <ArrowLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label="Następne zmiany"
          disabled={!canScrollNext}
          onClick={() => {
            scrollTimeline("next");
          }}
        >
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
