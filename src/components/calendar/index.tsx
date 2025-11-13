import { parse } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Link } from "@/components/core/link";
import { Button } from "@/components/ui/button";
import { WEEKDAYS } from "@/config/constants";
import { fetchQuery } from "@/features/backend";
import type { ApiCalendarEvent } from "@/features/backend/types";
import type { Resource } from "@/features/resources";
import { getMonthByNumberAndYear } from "@/lib/helpers";
import type { CalendarEvent } from "@/types/calendar";
import type { ResourcePageProps } from "@/types/components";

import { DayBlock } from "./day-block";

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

  const events: CalendarEvent[] = data.map((apiEvent) => ({
    ...apiEvent,
    startTime: new Date(apiEvent.startTime),
    endTime: new Date(apiEvent.endTime),
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
      ? ({
          type: "empty",
          id: `empty-${displayedYear.toString()}-${displayedMonth.toString()}-${index.toString()}`,
        } as const)
      : ({
          type: "day",
          id: index - startDayOfWeek + 1,
          day: index - startDayOfWeek + 1,
        } as const),
  );

  const getEventsForDay = (day: number) =>
    events.filter(
      (event) =>
        event.startTime.getDate() === day &&
        event.startTime.getMonth() + 1 === displayedMonth &&
        event.startTime.getFullYear() === displayedYear,
    );

  const getMonthLink = (newYear: number, newMonth: number) => {
    const adjustedDate = new Date(newYear, newMonth - 1);
    const urlSearchParameters = new URLSearchParams({
      year: adjustedDate.getFullYear().toString(),
      month: (adjustedDate.getMonth() + 1).toString(),
    });
    return `?${urlSearchParameters}` as const;
  };

  return (
    <div className="mx-auto grid h-fit w-full grid-cols-7 gap-1.5 sm:gap-2 lg:w-3/4">
      <div className="col-span-full flex items-center justify-center gap-4 text-center text-base font-bold sm:text-lg">
        <Button variant="ghost" size="icon" aria-label="Previous month" asChild>
          <Link href={getMonthLink(displayedYear, displayedMonth - 1)}>
            <ChevronLeft />
          </Link>
        </Button>
        <span className="min-w-[200px]">
          {currentDisplayedMonth.name} {displayedYear}
        </span>
        <Button variant="ghost" size="icon" aria-label="Next month" asChild>
          <Link href={getMonthLink(displayedYear, displayedMonth + 1)}>
            <ChevronRight />
          </Link>
        </Button>
      </div>
      <div className="col-span-full mt-4 grid grid-cols-subgrid gap-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold uppercase sm:text-sm"
          >
            {day}
          </div>
        ))}
      </div>
      {calendarDays.map((cell) => {
        if (cell.type === "empty") {
          return <div key={cell.id} />;
        }
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
      })}
    </div>
  );
}
