"use client";

import { getCurrentDate } from "@/lib/date-utils";

import { DayButton } from "./day-button";

interface Props {
  clickable?: boolean;
}

export function Calendar({ clickable = false }: Props) {
  const today = getCurrentDate();

  return (
    <div className="mx-auto mt-10 grid max-w-7xl grid-cols-7">
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
        {["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"].map((day, index) => (
          <div key={index} className="text-center font-semibold">
            {day}
          </div>
        ))}
      </div>
      {Array.from({ length: 31 }, (_, index) => {
        return (
          <DayButton
            key={index}
            day={index + 1}
            onClick={(day) => {
              console.warn(day);
            }}
          />
        );
      })}
    </div>
  );
}
