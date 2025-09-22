"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { API_URL } from "@/config/constants";
import { Resource } from "@/config/enums";
import { useAuth } from "@/hooks/use-auth";
import { useCalendarEvents } from "@/hooks/use-calendar-events";
import { getCurrentDate } from "@/lib/date-utils";
import type { CalendarEvent } from "@/types/calendar";
import type { DaySwap } from "@/types/dayswap";

import { AbstractResourceForm } from "../abstract/resource-form";
import { DaySwapForm } from "./add-dayswamp-form";
import { DayButton } from "./day-button";

interface Props {
  readonly clickable?: boolean;
}
interface DaySwapResponse {
  data: DaySwap[];
}

export function Calendar({ clickable = false }: Props) {
  const { events, loading, error } = useCalendarEvents();
  const today = getCurrentDate();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const hasError = Boolean(error);

  const { accessToken } = useAuth();
  const [daySwaps, setDaySwaps] = useState<DaySwap[]>([]);

  const firstDayOfMonth = new Date(today.year, today.month.value - 1, 1);
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

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
  //added for day swap

  useEffect(() => {
    async function fetchDaySwaps() {
      try {
        const response = await fetch(`${API_URL}/day_swaps`, {
          headers: {
            Authorization: `Bearer ${accessToken ?? ""}`,
          },
        });
        if (response.ok) {
          const payload = (await response.json()) as DaySwapResponse;
          setDaySwaps(Array.isArray(payload.data) ? payload.data : []);
        } else {
          console.error("Błąd pobierania day_swaps:", response.status);
        }
      } catch (fetchError) {
        console.error("Błąd:", fetchError);
      }
    }
    void fetchDaySwaps();
  }, [accessToken]);

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setSelectedEvent(null);
    setIsDialogOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDay(null);
    setIsDialogOpen(true);
  };

  const getEventsForDay = (day: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() + 1 === today.month.value &&
        eventDate.getFullYear() === today.year
      );
    });
  };
  const getSelectedDate = () => {
    if (selectedDay === null) {
      return;
    }
    return new Date(today.year, today.month.value - 1, selectedDay);
  };

  const getDialogTitle = () => {
    if (selectedEvent !== null) {
      return `Edytuj wydarzenie`;
    }
    if (selectedDay !== null) {
      return `${String(selectedDay)} ${today.month.name} ${String(today.year)}`;
    }
    return "";
  };
  const selectedDate = getSelectedDate();
  return (
    <div className="mx-auto mt-4 grid w-[95%] grid-cols-7 sm:mt-6 sm:w-[90%] md:mt-10 md:max-w-7xl lg:w-[85%]">
      <div className="col-span-7 text-center text-base font-bold sm:text-lg">
        {today.month.name} {today.year}
      </div>
      <div className="col-span-7 text-center text-xs text-gray-500 sm:text-sm">
        {today.month.daysInMonth} dni
      </div>
      <div className="col-span-7 text-center text-xs text-gray-500 sm:text-sm">
        Dzisiaj jest {today.day} {today.month.name} {today.year}
      </div>
      <div className="col-span-7 text-center text-xs text-gray-500 sm:text-sm">
        {clickable ? "Kliknij, aby wybrać dzień" : "Dni nie są klikalne"}
      </div>

      {loading ? (
        <div className="col-span-7 text-center text-sm text-gray-500">
          Ładowanie wydarzeń...
        </div>
      ) : hasError ? (
        <div className="col-span-7 text-center text-sm text-red-500">
          Błąd ładowania wydarzeń: {error}
        </div>
      ) : null}

      <div className="col-span-7 grid grid-cols-7 gap-1 sm:gap-2">
        {["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"].map((day) => (
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
          const dateKey = new Date(today.year, today.month.value - 1, cell.day)
            .toISOString()
            .split("T")[0];

          const swap = daySwaps.find((item) => item.date === dateKey);
          return (
            <DayButton
              key={cell.id}
              day={cell.day}
              today={today}
              clickable={clickable}
              events={dayEvents}
              swap={swap}
              onDayClick={handleDayClick}
              onEventClick={handleEventClick}
            />
          );
        }

        return null;
      })}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] w-max">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="h-[75vh] w-[90vw] overflow-auto sm:w-[70vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] 2xl:w-[30vw]">
            {selectedDay === null && selectedEvent !== null && (
              <AbstractResourceForm
                resource={Resource.EventCalendar}
                defaultValues={selectedEvent}
              />
            )}
            {selectedDay !== null && selectedDate !== undefined && (
              <DaySwapForm selectedDate={selectedDate} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
