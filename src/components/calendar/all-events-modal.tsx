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

interface Props {
  resource: CalendarEventTypes;
  events: CalendarEvent[];
  day: number;
  month: { name: string; value: number };
  year: number;
  clickable: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function AllEventsModal({
  resource,
  events,
  day,
  month,
  year,
  clickable,
  isOpen,
  onOpenChange,
  onEventClick,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-max max-h-[80vh] max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Wydarzenia - {day} {month.name} {year}
          </DialogTitle>
          <DialogDescription>
            Wszystkie wydarzenia zaplanowane na ten dzień
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 overflow-y-auto">
          {clickable ? (
            <Button asChild variant="outline">
              <Link
                href={`/${resource}/create/${year.toString()}-${month.value.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`}
              >
                Dodaj wydarzenie <PlusIcon />
              </Link>
            </Button>
          ) : null}
          {events.map((event) => (
            <Button
              key={event.id}
              type="button"
              onClick={() => {
                onEventClick(event);
              }}
              className="flex h-max w-full p-3 text-left text-sm"
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
                  />
                </div>
              ) : null}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
