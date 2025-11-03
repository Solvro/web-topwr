"use client";

import { useAtom } from "jotai";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { WEEKDAYS } from "@/config/constants";
import { Resource } from "@/config/enums";
import { useQueryWrapper } from "@/hooks/use-query-wrapper";
import { fetchQuery } from "@/lib/fetch-utils";
import { getMonthByNumberAndYear } from "@/lib/helpers";
import { getKey } from "@/lib/helpers/app";
import {
  checkAcademicSemesterEvents,
  extractStartDate,
} from "@/lib/helpers/calendar";
import { calendarStateAtom } from "@/stores/calendar";
import type { GetResourceWithRelationsResponse } from "@/types/api";
import type { CreatableResource } from "@/types/app";

import { AcademicSemesterListButton } from "./academic-semester-list-button";
import { DayButton } from "./day-button";

export function Calendar({
  clickable = false,
  resource,
}: {
  clickable?: boolean;
  resource: CreatableResource;
}) {
  const currentDate = new Date();
  const { data } = useQueryWrapper(
    getKey.query.resourceList(resource),
    async () =>
      fetchQuery<GetResourceWithRelationsResponse<typeof resource>>("", {
        resource,
        includeRelations: true,
      }),
  );
  const [events, setEvents] = useState<
    GetResourceWithRelationsResponse<typeof resource>["data"][]
  >([]);

  useEffect(() => {
    if (data === undefined) {
      setEvents([]);
      return;
    }
    setEvents(Array.isArray(data.data) ? data.data : [data.data]);
  }, [data]);

  const [calendarState, setCalendarState] = useAtom(calendarStateAtom);
  const { displayedYear, displayedMonth } = calendarState;

  const currentDisplayedMonth = getMonthByNumberAndYear(
    displayedMonth,
    displayedYear,
  );

  function goToPreviousMonth() {
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
  }

  function goToNextMonth() {
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
  }

  const firstDayOfMonth = new Date(displayedYear, displayedMonth - 1, 1);
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  const totalCells = startDayOfWeek + currentDisplayedMonth.daysInMonth;
  const calendarDays = Array.from({ length: totalCells }, (_, index) =>
    index < startDayOfWeek
      ? {
          type: "empty",
          id: `empty-${displayedYear.toString()}-${displayedMonth.toString()}-${index.toString()}`,
        }
      : {
          type: "day",
          id: index - startDayOfWeek + 1,
          day: index - startDayOfWeek + 1,
        },
  );

  function getEventsForDay(day: number) {
    return events.filter((event) => {
      const eventDate = extractStartDate(event);
      if (eventDate === null) {
        return false;
      }
      const dayMatches =
        eventDate.getDate() === day &&
        eventDate.getMonth() + 1 === displayedMonth &&
        eventDate.getFullYear() === displayedYear;

      if (resource === Resource.AcademicSemesters) {
        const dayDate = new Date(displayedYear, displayedMonth - 1, day);
        const { hasDaySwap, hasHoliday } = checkAcademicSemesterEvents(
          event,
          dayDate,
        );
        return dayMatches || hasDaySwap || hasHoliday;
      }

      return dayMatches;
    });
  }

  return (
    <>
      <div className="mx-auto grid h-min w-[95%] grid-cols-7 gap-1 sm:w-[90%] md:max-w-7xl lg:w-[85%]">
        <div className="col-span-7 flex items-center justify-center gap-4 text-center text-base font-bold sm:text-lg">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousMonth}
            className="h-8 w-8 rounded-xs border-2 p-0"
            aria-label="Previous month"
          >
            <ChevronLeft />
          </Button>
          <span className="min-w-[200px]">
            {currentDisplayedMonth.name} {displayedYear}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextMonth}
            className="h-8 w-8 rounded-xs border-2 p-0"
            aria-label="Next month"
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="col-span-7 mt-4 grid grid-cols-7 gap-1 sm:gap-2">
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
            return <div key={cell.id} className="h-16 md:h-20 lg:h-24"></div>;
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
                allEvents={events}
                resource={resource}
                currentDate={currentDate}
              />
            );
          }
          return null;
        })}
      </div>
      <div className="mt-4 flex w-[95%] flex-1 flex-row-reverse sm:w-[90%] md:max-w-7xl lg:w-[85%]">
        {resource === Resource.AcademicSemesters && (
          <AcademicSemesterListButton
            resource={resource}
            events={
              events as GetResourceWithRelationsResponse<
                typeof resource
              >["data"][]
            }
            clickable={clickable}
          />
        )}
      </div>
    </>
  );
}
