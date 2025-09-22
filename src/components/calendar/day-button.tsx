import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import type { CalendarEvent, DateObject } from "@/types/calendar";
import type { DaySwap } from "@/types/dayswap";

import { AllEventsModal } from "./all-events-modal";
import { EventBlock } from "./event-block";

interface Props {
  day: number;
  today: DateObject;
  clickable: boolean;
  events?: CalendarEvent[];
  swap?: DaySwap | null;
  onDayClick?: (day: number) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export function DayButton({
  day,
  today,
  clickable,
  events = [],
  swap = null,
  onDayClick,
  onEventClick,
}: Props) {
  const [isAllEventsModalOpen, setIsAllEventsModalOpen] = useState(false);
  const currentDate = useMemo(() => new Date(), []);
  const isCurrentDay =
    day === currentDate.getDate() &&
    today.month.value === currentDate.getMonth() + 1 &&
    today.year === currentDate.getFullYear();

  const handleDayClick = () => {
    if (clickable) {
      onDayClick?.(day);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    onEventClick?.(event);
  };

  const handleMoreEventsClick = (clickEvent: React.MouseEvent) => {
    clickEvent.stopPropagation(); // Prevent day click
    setIsAllEventsModalOpen(true);
  };

  const visibleEvents = events.slice(0, 2);
  const hasMoreThanThree = events.length > 3;
  const shouldShowThirdSlot = events.length > 2;

  return (
    <>
      <button
        type="button"
        className={cn(
          "relative flex h-16 flex-col border p-1 sm:h-24 md:h-28 lg:h-32",
          clickable ? "cursor-pointer hover:bg-gray-100" : "cursor-default",
          isCurrentDay ? "bg-blue-500 text-white" : "bg-white text-black",
        )}
        onClick={handleDayClick}
        disabled={!clickable}
        tabIndex={clickable ? 0 : -1}
        aria-disabled={!clickable}
      >
        {/* Day number in top left corner */}
        <div className="absolute top-1 left-1 text-xs font-semibold sm:text-sm">
          {day}
        </div>
        {swap === null ? null : (
          <div
            className="absolute top-1 right-1 h-3 w-3 rounded-full bg-blue-600"
            title={`${swap.changedWeekday} / ${swap.changedDayIsEven ? "parzysty" : "nieparzysty"}`}
          >
            {" "}
          </div>
        )}
        {/* Events container in bottom half */}
        <div className="mt-4 flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden sm:mt-6 md:mt-8">
          {/* Mobile version - show 1 event + more button if needed */}
          <div className="flex flex-wrap gap-1 sm:hidden">
            {events.slice(0, 1).map((event) => (
              <div
                key={event.id}
                role="button"
                tabIndex={0}
                onClick={(clickEvent) => {
                  clickEvent.stopPropagation();
                  handleEventClick(event);
                }}
                onKeyDown={(keyEvent) => {
                  if (keyEvent.key === "Enter" || keyEvent.key === " ") {
                    keyEvent.preventDefault();
                    keyEvent.stopPropagation();
                    handleEventClick(event);
                  }
                }}
                className="inline-block cursor-pointer rounded bg-blue-100 px-1 py-0.5 text-xs text-blue-800 hover:bg-blue-200"
                title={event.name}
              >
                {event.name.slice(0, 6) + (event.name.length > 6 ? "..." : "")}
              </div>
            ))}

            {events.length > 1 ? (
              <div
                role="button"
                tabIndex={0}
                onClick={handleMoreEventsClick}
                onKeyDown={(keyEvent) => {
                  if (keyEvent.key === "Enter" || keyEvent.key === " ") {
                    keyEvent.preventDefault();
                    keyEvent.stopPropagation();
                    handleMoreEventsClick(
                      keyEvent as unknown as React.MouseEvent,
                    );
                  }
                }}
                className="inline-block cursor-pointer rounded bg-gray-200 px-1 py-0.5 text-xs text-gray-700 hover:bg-gray-300"
              >
                +{String(events.length - 1)}
              </div>
            ) : null}
          </div>

          {/* Desktop version - show 2 events + more button */}
          <div className="hidden flex-col gap-0.5 sm:flex">
            {visibleEvents.map((event) => (
              <EventBlock
                key={event.id}
                event={event}
                onClick={handleEventClick}
              />
            ))}

            {shouldShowThirdSlot ? (
              <div
                role="button"
                tabIndex={0}
                onClick={handleMoreEventsClick}
                onKeyDown={(keyEvent) => {
                  if (keyEvent.key === "Enter" || keyEvent.key === " ") {
                    keyEvent.preventDefault();
                    keyEvent.stopPropagation();
                    handleMoreEventsClick(
                      keyEvent as unknown as React.MouseEvent,
                    );
                  }
                }}
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
      </button>

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
