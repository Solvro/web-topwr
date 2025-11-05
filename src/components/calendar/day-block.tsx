"use client";

import { useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";

import { Button } from "@/components/ui/button";
import { CALENDAR_MAX_EVENTS_PER_DAY } from "@/config/constants";
import type { Resource } from "@/config/enums";
import type { CalendarEvent, DateObject } from "@/types/calendar";

import { Badge } from "../ui/badge";
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
        variant={isCurrentDay ? "default" : "secondary"}
        className="relative flex h-16 flex-col p-1 md:h-20 lg:h-28"
        onClick={handleDayClick}
        onKeyDown={handleDayKeyDown}
      >
        <div className="text-s absolute top-1.5 left-2 font-bold sm:text-lg">
          {day}
        </div>

        <div className="mt-4 flex min-h-0 w-full flex-1 flex-col-reverse gap-0.5 overflow-hidden sm:mt-6 md:mt-13">
          {events.slice(0, CALENDAR_MAX_EVENTS_PER_DAY).map((event) => (
            <Badge
              key={event.id}
              className="h-2 w-1/3 truncate"
              variant={isCurrentDay ? "secondary" : "default"}
            />
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
