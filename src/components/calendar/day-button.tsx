"use client";

import { useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";

import { Button } from "@/components/ui/button";
import { CALENDAR_MAX_EVENTS_PER_DAY } from "@/config/constants";
import type { Resource } from "@/config/enums";
import { cn } from "@/lib/utils";
import type { CalendarEvent, DateObject } from "@/types/calendar";

import { AllEventsModal } from "./all-events-modal";

export function DayBlock({
  day,
  today,
  clickable,
  resource,
  events = [],
  currentDate,
}: {
  day: number;
  today: DateObject;
  clickable: boolean;
  resource: Resource;
  currentDate: Date;
  events?: CalendarEvent[];
  onDayClick?: () => void;
}) {
  const [isAllEventsModalOpen, setIsAllEventsModalOpen] = useState(false);
  const isCurrentDay =
    day === currentDate.getDate() &&
    today.month.value === currentDate.getMonth() + 1 &&
    today.year === currentDate.getFullYear();

  function handleDayClick(clickEvent: MouseEvent) {
    clickEvent.stopPropagation();
    setIsAllEventsModalOpen(true);
  }

  function handleDayKeyDown(keyEvent: KeyboardEvent) {
    if (keyEvent.key === "Enter" || keyEvent.key === " ") {
      keyEvent.preventDefault();
      keyEvent.stopPropagation();
      setIsAllEventsModalOpen(true);
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        className={cn(
          "relative flex h-16 flex-col rounded-none border p-1 sm:h-24 md:h-28 lg:h-32",
          { "bg-blue-500 text-white": isCurrentDay },
        )}
        onClick={handleDayClick}
        onKeyDown={handleDayKeyDown}
      >
        <div className="absolute top-1 left-1 text-xs font-semibold sm:text-sm">
          {day}
        </div>

        <div className="mt-4 flex min-h-0 w-full flex-1 flex-col-reverse gap-0.5 overflow-hidden sm:mt-6 md:mt-13">
          {events.slice(0, CALENDAR_MAX_EVENTS_PER_DAY).map((event) => (
            <div key={event.id} className="bg-primary h-2 rounded-md" />
          ))}
        </div>
      </Button>

      <AllEventsModal
        resource={resource}
        clickable={clickable}
        events={events}
        day={day}
        month={today.month}
        year={today.year}
        isOpen={isAllEventsModalOpen}
        onOpenChange={setIsAllEventsModalOpen}
      />
    </>
  );
}
