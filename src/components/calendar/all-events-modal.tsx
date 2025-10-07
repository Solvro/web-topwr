import { Edit, PlusIcon } from "lucide-react";
import Link from "next/link";

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

import { DeleteButtonWithDialog } from "../delete-button-with-dialog";
import { Button } from "../ui/button";

export function AllEventsModal({
  resource,
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
        <div className="space-y-2 overflow-y-auto">
          {events.map((event) => (
            <div
              key={event.id}
              className="text-accent bg-primary flex h-max w-full rounded-md p-3 text-left text-sm"
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
                <div className="ml-auto flex gap-1.5">
                  <Button
                    asChild
                    variant="outline"
                    className="text-primary h-10 w-10"
                  >
                    <Link href={`/${resource}/edit/${event.id}`}>
                      <Edit />
                    </Link>
                  </Button>
                  <DeleteButtonWithDialog
                    resource={Resource.CalendarEvents}
                    id={event.id}
                    variant="destructive"
                  />
                </div>
              ) : null}
            </div>
          ))}
          {clickable ? (
            <Button asChild variant="outline" className="float-right">
              <Link
                href={`/${resource}/create/${year.toString()}-${month.value.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`}
              >
                Dodaj wydarzenie <PlusIcon />
              </Link>
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
