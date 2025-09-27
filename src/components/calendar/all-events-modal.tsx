import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CalendarEvent } from "@/types/calendar";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  events: CalendarEvent[];
  day: number;
  monthName: string;
  year: number;
  onEventClick: (event: CalendarEvent) => void;
}

const hasDescription = (event: CalendarEvent) =>
  Boolean(event.description) && event.description !== "";

const hasLocation = (event: CalendarEvent) =>
  Boolean(event.location) && event.location !== "";

export function AllEventsModal({
  isOpen,
  onOpenChange,
  events,
  day,
  monthName,
  year,
  onEventClick,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Wydarzenia - {day} {monthName} {year}
          </DialogTitle>
          <DialogDescription>
            Wszystkie wydarzenia zaplanowane na ten dzień
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 overflow-y-auto">
          {events.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => {
                onEventClick(event);
                onOpenChange(false); // Close the modal after clicking an event
              }}
              className="w-full rounded bg-blue-100 p-3 text-left text-sm text-blue-800 hover:bg-blue-200"
              title={event.description ?? ""}
            >
              <div className="font-medium">{event.name}</div>
              {hasDescription(event) ? (
                <div className="mt-1 text-xs text-blue-600">
                  {event.description}
                </div>
              ) : null}
              {hasLocation(event) ? (
                <div className="mt-1 text-xs text-blue-600">
                  📍 {event.location}
                </div>
              ) : null}
              <div className="mt-1 text-xs text-blue-600">
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
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
