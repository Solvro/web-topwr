import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CALENDAR_MAX_EVENTS_PER_DAY } from "@/config/constants";
import type { Resource } from "@/config/enums";
import type { CalendarEvent, DateObject } from "@/types/calendar";

import { AllEventsModal } from "./all-events-modal";

export function DayBlock({
  day,
  today,
  clickable,
  resource,
  events = [],
  currentDate,
}: {
  day: number;
  today: DateObject;
  clickable: boolean;
  resource: Resource;
  currentDate: Date;
  events?: CalendarEvent[];
  onDayClick?: () => void;
}) {
  const isCurrentDay =
    day === currentDate.getDate() &&
    today.month.value === currentDate.getMonth() + 1 &&
    today.year === currentDate.getFullYear();

  return (
    <AllEventsModal
      resource={resource}
      clickable={clickable}
      events={events}
      day={day}
      month={today.month}
      year={today.year}
    >
      <Button
        variant={isCurrentDay ? "default" : "secondary"}
        className="relative flex h-16 flex-col items-start justify-between p-1 md:h-20 lg:h-24 xl:h-28"
        style={{
          viewTransitionName: `calendar-day-${String(day)}`,
        }}
      >
        <div className="mt-0.5 ml-1 text-xs font-semibold sm:mt-1.5 sm:ml-2 sm:font-bold md:text-base lg:text-lg">
          {day}
        </div>

        <div className="flex w-full items-center gap-2 overflow-hidden max-sm:hidden">
          <div className="flex w-full flex-col gap-0.5 md:w-2/3 lg:w-1/2">
            {events.slice(0, CALENDAR_MAX_EVENTS_PER_DAY).map((event) => (
              <Badge
                key={event.id}
                className="h-2 w-full"
                variant={isCurrentDay ? "secondary" : "default"}
                title={event.name}
                aria-label={event.name}
              />
            ))}
          </div>
          {events.length > CALENDAR_MAX_EVENTS_PER_DAY ? (
            <Badge
              size="counter"
              aria-label={`Liczba ukrytych wydarzeń dnia ${String(day)}`}
            >
              +{events.length - CALENDAR_MAX_EVENTS_PER_DAY}
            </Badge>
          ) : null}
        </div>
        {events.length === 0 ? null : (
          <Badge
            size="counter"
            className="m-auto sm:hidden"
            aria-label={`Liczba wydarzeń dnia ${String(day)}`}
          >
            {events.length}
          </Badge>
        )}
      </Button>
    </AllEventsModal>
  );
}
