import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";

import type { CalendarEventTypes } from "@/config/enums";
import { formatDate } from "@/lib/helpers/calendar";
import { cn } from "@/lib/utils";
import type { CalendarEvent, DateObject } from "@/types/calendar";

import { Button } from "../ui/button";
import { AllEventsModal } from "./all-events-modal";
import { EventBlock } from "./event-block";

interface Props {
  day: number;
  today: DateObject;
  clickable: boolean;
  resource: CalendarEventTypes;
  events?: CalendarEvent[];
  onDayClick?: () => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export function DayBlock({
  day,
  today,
  clickable,
  resource,
  events = [],
  onEventClick,
}: Props) {
  const [isAllEventsModalOpen, setIsAllEventsModalOpen] = useState(false);
  const currentDate = useMemo(() => new Date(), []);
  const isCurrentDay =
    day === currentDate.getDate() &&
    today.month.value === currentDate.getMonth() + 1 &&
    today.year === currentDate.getFullYear();

  function handleEventClick(event: CalendarEvent) {
    onEventClick?.(event);
  }

  function handleMoreEventsClick(clickEvent: MouseEvent) {
    clickEvent.stopPropagation();
    setIsAllEventsModalOpen(true);
  }

  function handleKeyDown(keyEvent: KeyboardEvent) {
    if (keyEvent.key === "Enter" || keyEvent.key === " ") {
      keyEvent.preventDefault();
      keyEvent.stopPropagation();
      setIsAllEventsModalOpen(true);
    }
  }

  const visibleEvents = events.slice(0, 2);
  const hasMoreThanThree = events.length > 3;
  const shouldShowThirdSlot = events.length > 2;

  return (
    <>
      <div
        className={cn(
          "relative flex h-16 flex-col border p-1 sm:h-24 md:h-28 lg:h-32",
          isCurrentDay ? "bg-blue-500 text-white" : "bg-white text-black",
        )}
      >
        <div className="absolute top-1 left-1 text-xs font-semibold sm:text-sm">
          {day}
        </div>

        {clickable ? (
          <Button className="absolute top-1 right-1">
            <Link href={`/${resource}/create/${formatDate(today)}`}>
              <PlusIcon />
            </Link>
          </Button>
        ) : null}

        {/* Events container in bottom half */}
        <div className="mt-4 flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden sm:mt-6 md:mt-13">
          {/* Mobile version - show 1 event using EventBlock + more button if needed */}
          <div className="flex flex-wrap gap-1 sm:hidden">
            {events.slice(0, 1).map((event) => (
              <EventBlock
                key={event.id}
                event={event}
                clickable={clickable}
                resource={resource}
                onClick={handleEventClick}
                className="inline-block"
              />
            ))}

            {events.length > 1 ? (
              <div
                role="button"
                tabIndex={0}
                onClick={handleMoreEventsClick}
                onKeyDown={handleKeyDown}
                className="inline-block cursor-pointer rounded bg-gray-200 px-1 py-0.5 text-xs text-gray-700 hover:bg-gray-300"
              >
                +{String(events.length - 1)}
              </div>
            ) : null}
          </div>

          {/* Desktop version - show 2 events using EventBlock + more button */}
          <div className="hidden flex-col gap-0.5 sm:flex">
            {visibleEvents.map((event) => (
              <EventBlock
                key={event.id}
                event={event}
                clickable={clickable}
                resource={resource}
                onClick={handleEventClick}
              />
            ))}

            {shouldShowThirdSlot ? (
              <div
                role="button"
                tabIndex={0}
                onClick={handleMoreEventsClick}
                onKeyDown={handleKeyDown}
                className={cn(
                  "w-full cursor-pointer rounded bg-gray-200 px-1 py-0.5 text-left text-xs text-gray-700 hover:bg-gray-300",
                  hasMoreThanThree ? "" : "opacity-75",
                )}
              >
                {hasMoreThanThree
                  ? `+${String(events.length - 2)} więcej`
                  : (events[2]?.name?.slice(0, 15) ?? "") +
                    ((events[2]?.name?.length ?? 0) > 15 ? "..." : "")}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <AllEventsModal
        isOpen={isAllEventsModalOpen}
        onOpenChange={setIsAllEventsModalOpen}
        events={events}
        day={day}
        monthName={today.month.name}
        year={today.year}
        onEventClick={handleEventClick}
      />
    </>
  );
}
