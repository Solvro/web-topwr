"use client";

import { getCurrentDate } from "@/lib/date-utils";

import { DayButton } from "./day-button";

interface Props {
  readonly clickable?: boolean;
}

export function Calendar({ clickable = false }: Props) {
  const today = getCurrentDate();

  // Calculate the first day of the month and what day of week it falls on
  const firstDayOfMonth = new Date(today.year, today.month.value - 1, 1);
  // Get day of week (0 = Sunday, 1 = Monday, etc.) and convert to Polish calendar (Monday = 0)
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  // Create array of all calendar cells (empty + actual days)
  const totalCells = startDayOfWeek + today.month.daysInMonth;
  const calendarDays = Array.from({ length: totalCells }, (_, index) => {
    if (index < startDayOfWeek) {
      return {
        type: "empty",
        id: `empty-${today.year.toString()}-${today.month.value.toString()}-${index.toString()}`,
      }; // Empty cell before month starts
    }
    return {
      type: "day",
      id: index - startDayOfWeek + 1,
      day: index - startDayOfWeek + 1,
    }; // Actual day number
  });

  return (
    <div className="mx-auto mt-10 grid w-[85%] grid-cols-7 md:max-w-7xl">
      <div className="col-span-7 text-center text-lg font-bold">
        {today.month.name} {today.year}
      </div>
      <div className="col-span-7 text-center text-sm text-gray-500">
        {today.month.daysInMonth} dni
      </div>
      <div className="col-span-7 text-center text-sm text-gray-500">
        Dzisiaj jest {today.day} {today.month.name} {today.year}
      </div>
      <div className="col-span-7 text-center text-sm text-gray-500">
        {clickable ? "Kliknij, aby wybrać dzień" : "Dni nie są klikalne"}
      </div>
      <div className="col-span-7 grid grid-cols-7 gap-2">
        {["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"].map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
      </div>
      {calendarDays.map((cell) => {
        if (cell.type === "empty") {
          // Empty cell for days before month starts
          return <div key={cell.id} className="h-20"></div>;
        }

        if (cell.type === "day" && cell.day !== undefined) {
          return (
            <DayButton
              key={cell.id}
              day={cell.day}
              today={today}
              clickable={clickable}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
