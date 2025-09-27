"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { WEEKDAYS } from "@/config/constants";
import type { CalendarEventTypes } from "@/config/enums";
import { useGenericCalendarEvents } from "@/hooks/use-calendar-events";
import { transformApiEventsToCalendarEvents } from "@/lib/calendar-utils";
import { getMonthByNumberAndYear } from "@/lib/date-utils";
import { calendarStateAtom } from "@/stores/calendar";
import type { ApiCalendarEvent } from "@/types/api";
import type { CalendarEvent } from "@/types/calendar";

import { DayButton } from "./day-button";
import { EventDetailsModal } from "./event-details-modal";

interface Props {
  readonly clickable?: boolean;
  readonly resource: CalendarEventTypes;
}

export function Calendar({ clickable = false, resource }: Props) {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);

  const { events } = useGenericCalendarEvents<ApiCalendarEvent>({
    resource,
    transformFunction: transformApiEventsToCalendarEvents,
  });

  // Use Jotai atom for calendar state persistence
  const [calendarState, setCalendarState] = useAtom(calendarStateAtom);
  const { displayedYear, displayedMonth } = calendarState;

  // Get the month object for the currently displayed month
  const currentDisplayedMonth = getMonthByNumberAndYear(
    displayedMonth,
    displayedYear,
  );
  // Navigation functions
  const goToPreviousMonth = () => {
    if (displayedMonth === 1) {
      setCalendarState({
        displayedMonth: 12,
        displayedYear: displayedYear - 1,
      });
    } else {
      setCalendarState({
        displayedMonth: displayedMonth - 1,
        displayedYear,
      });
    }
  };

  const goToNextMonth = () => {
    if (displayedMonth === 12) {
      setCalendarState({
        displayedMonth: 1,
        displayedYear: displayedYear + 1,
      });
    } else {
      setCalendarState({
        displayedMonth: displayedMonth + 1,
        displayedYear,
      });
    }
  };

  const firstDayOfMonth = new Date(displayedYear, displayedMonth - 1, 1);
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  const totalCells = startDayOfWeek + currentDisplayedMonth.daysInMonth;
  const calendarDays = Array.from({ length: totalCells }, (_, index) => {
    if (index < startDayOfWeek) {
      return {
        type: "empty",
        id: `empty-${displayedYear.toString()}-${displayedMonth.toString()}-${index.toString()}`,
      }; // Empty cell before month starts
    }
    return {
      type: "day",
      id: index - startDayOfWeek + 1,
      day: index - startDayOfWeek + 1,
    }; // Actual day number
  });

  const getEventsForDay = (day: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() + 1 === displayedMonth &&
        eventDate.getFullYear() === displayedYear
      );
    });
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (clickable) {
      // When clickable is true, navigate to edit page
      router.push(`/${resource}/edit/${event.id}`);
    } else {
      // When clickable is false, show event details modal
      setSelectedEvent(event);
      setIsEventDetailsModalOpen(true);
    }
  };

  return (
    <div className="mx-auto mt-4 grid h-fit w-[95%] grid-cols-7 overflow-y-auto sm:mt-6 sm:w-[90%] md:mt-10 md:max-w-7xl lg:w-[85%]">
      <div className="col-span-7 flex items-center justify-center gap-4 text-center text-base font-bold sm:text-lg">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousMonth}
          className="h-8 w-8 p-0"
          aria-label="Previous month"
        >
          ←
        </Button>
        <span className="min-w-[200px]">
          {currentDisplayedMonth.name} {displayedYear}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextMonth}
          className="h-8 w-8 p-0"
          aria-label="Next month"
        >
          →
        </Button>
      </div>

      <div className="col-span-7 grid grid-cols-7 gap-1 sm:gap-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold sm:text-sm"
          >
            {day}
          </div>
        ))}
      </div>
      {calendarDays.map((cell) => {
        if (cell.type === "empty") {
          // Empty cell for days before month starts
          return (
            <div key={cell.id} className="h-16 sm:h-24 md:h-28 lg:h-32"></div>
          );
        }

        if (cell.type === "day" && cell.day !== undefined) {
          const dayEvents = getEventsForDay(cell.day);
          const displayedDateObject = {
            year: displayedYear,
            month: currentDisplayedMonth,
            day: cell.day,
          };
          return (
            <DayButton
              key={cell.id}
              day={cell.day}
              today={displayedDateObject}
              clickable={clickable}
              events={dayEvents}
              onDayClick={() => {
                router.push(`/${resource}/create`);
              }}
              onEventClick={handleEventClick}
            />
          );
        }
        return null;
      })}
      <EventDetailsModal
        isOpen={isEventDetailsModalOpen}
        onOpenChange={setIsEventDetailsModalOpen}
        event={selectedEvent}
        resource={resource}
      />
    </div>
  );
}
