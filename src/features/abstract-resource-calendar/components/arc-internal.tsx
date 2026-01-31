"use client";

import { format, getDaysInMonth, parse } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Link } from "@/components/core/link";
import { Button } from "@/components/ui/button";
import type { SearchParameters } from "@/types/components";

import { WEEKDAYS } from "../constants";
import type { MappedCalendarData } from "../types/internal";
import { getEventsForDay } from "../utils/get-events-for-day";
import { getMonthLink } from "../utils/get-month-link";
import { DayButton } from "./arc-day-button";

export function CalendarInternal({
  clickable = false,
  searchParams,
  mappedData,
  onDayClick,
}: {
  clickable?: boolean;
  searchParams: SearchParameters;
  mappedData: MappedCalendarData;
  onDayClick: (dayKey: string) => void;
}) {
  const { year, month } = searchParams;
  const todayDate = new Date();
  const displayedYear = (
    year == null ? todayDate : parse(year, "yyyy", todayDate)
  ).getFullYear();
  const displayedMonth =
    (month == null ? todayDate : parse(month, "MM", todayDate)).getMonth() + 1;

  const currentDisplayedMonth = new Date(displayedYear, displayedMonth - 1, 1);
  const startDayOfWeek = (currentDisplayedMonth.getDay() + 6) % 7;
  const totalCells = startDayOfWeek + getDaysInMonth(currentDisplayedMonth);

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

  return (
    <section className="mx-auto grid h-fit w-full grid-cols-7 gap-1.5 sm:gap-2 lg:w-3/4">
      <article className="col-span-full flex items-center justify-center gap-4 text-center text-base font-bold sm:text-lg">
        <Button variant="ghost" size="icon" aria-label="Previous month" asChild>
          <Link href={getMonthLink(displayedYear, displayedMonth - 1)}>
            <ChevronLeft />
          </Link>
        </Button>
        <span className="min-w-[200px]">
          {format(currentDisplayedMonth, "MMMM")} {displayedYear}
        </span>
        <Button variant="ghost" size="icon" aria-label="Next month" asChild>
          <Link href={getMonthLink(displayedYear, displayedMonth + 1)}>
            <ChevronRight />
          </Link>
        </Button>
      </article>
      <article className="col-span-full mt-4 grid grid-cols-subgrid gap-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold uppercase sm:text-sm"
          >
            {day}
          </div>
        ))}
      </article>
      {calendarDays.map((cell) => {
        if (cell.type === "empty") {
          return <div key={cell.id} />;
        }

        const cellDate = new Date(currentDisplayedMonth.setDate(cell.day));
        const dayEvents = getEventsForDay(cellDate, mappedData);

        return (
          <DayButton
            key={cell.id}
            dayButtonDate={cellDate}
            clickable={clickable}
            eventsForDay={dayEvents}
            currentDate={todayDate}
            onDayClick={() => {
              onDayClick(format(cellDate, "yyyy-MM-dd"));
            }}
          />
        );
      })}
    </section>
  );
}
