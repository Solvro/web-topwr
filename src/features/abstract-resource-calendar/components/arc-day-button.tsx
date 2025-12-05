import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { DateObject, EventCardType } from "../types/internal";
import { EventBadge } from "./arc-event-badge";

export function DayButton({
  day,
  today,
  clickable,
  eventsForDay,
  currentDate,
  onDayClick,
}: {
  day: number;
  today: DateObject;
  clickable: boolean;
  currentDate: Date;
  eventsForDay: EventCardType[];
  onDayClick: () => void;
}) {
  const isCurrentDay =
    day === currentDate.getDate() &&
    today.month.value === currentDate.getMonth() + 1 &&
    today.year === currentDate.getFullYear();

  return (
    <Button
      variant={isCurrentDay ? "default" : "secondary"}
      className={cn(
        "relative flex h-16 flex-col items-start justify-between p-1 md:h-20 lg:h-24 xl:h-28",
        clickable ? "cursor-pointer" : "cursor-default",
      )}
      style={{
        viewTransitionName: `calendar-day-${String(day)}`,
      }}
      onClick={onDayClick}
    >
      <p className="mt-0.5 ml-1 text-xs font-semibold sm:mt-1.5 sm:ml-2 sm:font-bold md:text-base lg:text-lg">
        {day}
      </p>

      {eventsForDay.length > 0 && (
        <EventBadge
          events={eventsForDay}
          isCurrentDay={isCurrentDay}
          day={day}
        />
      )}
    </Button>
  );
}
