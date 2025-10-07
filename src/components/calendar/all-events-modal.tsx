import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Resource } from "@/config/enums";
import type { CalendarEventTypes } from "@/config/enums";
import type { CalendarEvent } from "@/types/calendar";

import { CreateButton } from "../abstract/create-button";
import { EditButton } from "../abstract/edit-button";
import { DeleteButtonWithDialog } from "../delete-button-with-dialog";

export function AllEventsModal({
  events,
  day,
  month,
  year,
  clickable,
  isOpen,
  onOpenChange,
}: {
  resource: CalendarEventTypes;
  events: CalendarEvent[];
  day: number;
  month: { name: string; value: number };
  year: number;
  clickable: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-max max-h-[80vh] max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Wydarzenia {day} {month.name} {year}
          </DialogTitle>
          <DialogDescription>
            {events.length === 0
              ? "Brak wydarzeń zaplanowanych na ten dzień"
              : "Wszystkie wydarzenia zaplanowane na ten dzień"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-end gap-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-accent flex h-max w-full rounded-md p-3 text-left text-sm"
              title={event.description ?? ""}
            >
              <div>
                <div className="font-medium">{event.name}</div>
                <div className="mt-1 text-xs">
                  {event.startTime.toLocaleTimeString("pl-PL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {event.endTime.toLocaleTimeString("pl-PL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              {clickable ? (
                <div className="ml-auto flex">
                  <EditButton
                    resource={Resource.CalendarEvents}
                    id={event.id}
                  />
                  <DeleteButtonWithDialog
                    resource={Resource.CalendarEvents}
                    id={event.id}
                  />
                </div>
              ) : null}
            </div>
          ))}
          {clickable ? (
            <CreateButton resource={Resource.CalendarEvents} />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
