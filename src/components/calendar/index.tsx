import { parse } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { WEEKDAYS } from "@/config/constants";
import type { Resource } from "@/config/enums";
import { fetchQuery } from "@/lib/fetch-utils";
import { getMonthByNumberAndYear } from "@/lib/helpers";
import type { ApiCalendarEvent } from "@/types/api";
import type { ResourcePageProps } from "@/types/components";

import { DayBlock } from "./day-button";

export async function Calendar({
  clickable = false,
  resource,
  searchParams,
}: {
  clickable?: boolean;
  resource: Resource;
} & ResourcePageProps) {
  const { data } = await fetchQuery<{ data: ApiCalendarEvent[] }>("", {
    resource,
  });

  const events = data.map((apiEvent) => ({
    id: apiEvent.id,
    name: apiEvent.name,
    description: apiEvent.description ?? undefined,
    startTime: new Date(apiEvent.startTime),
    endTime: new Date(apiEvent.endTime),
    location: apiEvent.location ?? undefined,
    googleCallId: apiEvent.googleCallId ?? undefined,
  }));

  const { year, month } = await searchParams;
  const currentDate = new Date();
  const displayedYear = (
    year == null ? currentDate : parse(year, "yyyy", currentDate)
  ).getFullYear();
  const displayedMonth =
    (month == null ? currentDate : parse(month, "MM", currentDate)).getMonth() +
    1;

  const currentDisplayedMonth = getMonthByNumberAndYear(
    displayedMonth,
    displayedYear,
  );

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

  const getMonthLink = (newYear: number, newMonth: number) => {
    const adjustedDate = new Date(newYear, newMonth - 1);
    const urlSearchParameters = new URLSearchParams({
      year: adjustedDate.getFullYear().toString(),
      month: (adjustedDate.getMonth() + 1).toString(),
    });
    return `?${urlSearchParameters}` as const;
  };

  return (
    <div className="mx-auto grid h-fit w-[95%] grid-cols-7 sm:w-[90%] md:max-w-7xl lg:w-[85%]">
      <div className="col-span-7 flex items-center justify-center gap-4 text-center text-base font-bold sm:text-lg">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Previous month"
          asChild
        >
          <Link href={getMonthLink(displayedYear, displayedMonth - 1)}>
            <ArrowLeft />
          </Link>
        </Button>
        <span className="min-w-[200px]">
          {currentDisplayedMonth.name} {displayedYear}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Next month"
          asChild
        >
          <Link href={getMonthLink(displayedYear, displayedMonth + 1)}>
            <ArrowRight />
          </Link>
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
            <DayBlock
              key={cell.id}
              day={cell.day}
              today={displayedDateObject}
              clickable={clickable}
              events={dayEvents}
              resource={resource}
              currentDate={currentDate}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
