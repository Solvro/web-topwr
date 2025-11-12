"use client";

import { formatDate, isSameDay } from "date-fns";
import { pl } from "date-fns/locale";
import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Resource } from "@/config/enums";
import { declineNumeric } from "@/features/polish";
import { getRoundedDate } from "@/lib/helpers";
import type { CalendarEvent } from "@/types/calendar";

import { CreateButton } from "../abstract/create-button";
import { DeleteButtonWithDialog } from "../abstract/delete-button-with-dialog";
import { EditButton } from "../abstract/edit-button";

const formatTime = (event: CalendarEvent, timeType: "startTime" | "endTime") =>
  formatDate(
    event[timeType],
    isSameDay(event.startTime, event.endTime) ? "HH:mm" : "HH:mm (E)",
    { locale: pl },
  );

export function AllEventsModal({
  events,
  day,
  month,
  year,
  clickable,
  children,
}: {
  resource: Resource;
  events: CalendarEvent[];
  day: number;
  month: { name: string; value: number };
  year: number;
  clickable: boolean;
  children: ReactNode;
}) {
  const baseDate = new Date(year, month.value - 1, day);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="h-max max-h-[80vh] max-w-lg"
        onOpenAutoFocus={(event_) => {
          event_.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            Wydarzenia {formatDate(baseDate, "d MMMM yyyy", { locale: pl })}
          </DialogTitle>
          <DialogDescription>
            {events.length === 0
              ? "Brak wydarzeń zaplanowanych na ten dzień"
              : `W tym dniu zaplanowano ${declineNumeric(events.length, "wydarzenie", "wydarzenia", "wydarzeń")}.`}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex max-h-[50svh] flex-col gap-2 overflow-y-auto">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-accent flex w-full justify-between rounded-md p-3 text-left text-sm"
                title={event.description ?? ""}
              >
                <div>
                  <div className="font-medium">{event.name}</div>
                  <div className="mt-1 text-xs">
                    {formatTime(event, "startTime")}
                    {event.startTime === event.endTime ? (
                      ""
                    ) : (
                      <>—{formatTime(event, "endTime")}</>
                    )}
                  </div>
                </div>
                {clickable ? (
                  <div className="flex items-center">
                    <EditButton
                      resource={Resource.CalendarEvents}
                      id={event.id}
                    />
                    <DeleteButtonWithDialog
                      resource={Resource.CalendarEvents}
                      itemName={event.name}
                      id={event.id}
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          {clickable ? (
            <CreateButton
              resource={Resource.CalendarEvents}
              prefillAttributes={{
                startTime: getRoundedDate(8, baseDate),
                endTime: getRoundedDate(20, baseDate),
              }}
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
