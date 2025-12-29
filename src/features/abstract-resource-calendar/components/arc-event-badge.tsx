import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { CALENDAR_MAX_EVENTS_PER_DAY } from "@/features/abstract-resource-list/constants";

export function EventBadge({
  events,
  isCurrentDay,
  day,
  limitToOne = false,
}: {
  events: ReactNode[];
  isCurrentDay: boolean;
  day: number;
  limitToOne?: boolean;
}) {
  return (
    <article className="flex w-full items-center gap-2 overflow-hidden max-sm:hidden">
      <section className="flex w-full flex-col gap-0.5 md:w-2/3 lg:w-1/2">
        {events
          .slice(0, limitToOne ? 1 : CALENDAR_MAX_EVENTS_PER_DAY)
          .map((_, id) => (
            <Badge
              key={`${String(day)}-${String(id)}`}
              className="h-2 w-full"
              variant={isCurrentDay ? "secondary" : "default"}
            />
          ))}
      </section>
      {events.length > CALENDAR_MAX_EVENTS_PER_DAY && !limitToOne ? (
        <>
          <Badge
            size="counter"
            aria-label={`Liczba ukrytych wydarzeń dnia ${String(day)}`}
          >
            +{events.length - CALENDAR_MAX_EVENTS_PER_DAY}
          </Badge>
          <Badge
            size="counter"
            className="m-auto sm:hidden"
            aria-label={`Liczba wydarzeń dnia ${String(day)}`}
          >
            {events.length}
          </Badge>
        </>
      ) : null}
    </article>
  );
}
