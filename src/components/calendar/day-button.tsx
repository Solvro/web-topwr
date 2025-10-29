import { useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";

import { Button } from "@/components/ui/button";
import { CALENDAR_MAX_EVENTS_PER_DAY } from "@/config/constants";
import { Resource } from "@/config/enums";
import { cn } from "@/lib/utils";
import type { GetResourceWithRelationsResponse } from "@/types/api";
import type { CreatableResource } from "@/types/app";
import type { DateObject } from "@/types/calendar";

import { AllEventsModal } from "./all-events-modal";

export function DayButton<T extends CreatableResource>({
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
  resource: T;
  currentDate: Date;
  events?: GetResourceWithRelationsResponse<T>["data"][];
  onDayClick?: () => void;
}) {
  const [isAllEventsModalOpen, setIsAllEventsModalOpen] = useState(false);
  const isCurrentDay =
    day === currentDate.getDate() &&
    today.month.value === currentDate.getMonth() + 1 &&
    today.year === currentDate.getFullYear();

  function handleDayClick(clickEvent: MouseEvent) {
    clickEvent.stopPropagation();
    setIsAllEventsModalOpen(true);
  }

  function handleDayKeyDown(keyEvent: KeyboardEvent) {
    if (keyEvent.key === "Enter" || keyEvent.key === " ") {
      keyEvent.preventDefault();
      keyEvent.stopPropagation();
      setIsAllEventsModalOpen(true);
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        className={cn(
          "bg-accent relative flex h-16 flex-col p-1 md:h-20 lg:h-24",
          { "bg-blue-500 text-white": isCurrentDay },
        )}
        onClick={handleDayClick}
        onKeyDown={handleDayKeyDown}
      >
        <div className="text-s absolute top-1.5 left-2 font-bold sm:text-lg">
          {day}
        </div>

        <div className="mt-4 flex min-h-0 w-full flex-1 flex-col-reverse gap-0.5 overflow-hidden sm:mt-6 md:mt-2">
          {resource === Resource.AcademicSemesters ? (
            <>
              {events.map((event) => {
                const daySwaps = event.daySwaps;
                const holidays = event.holidays;

                return (
                  <>
                    {daySwaps.length > 0 && (
                      <div
                        key={daySwaps[0].id}
                        className="bg-secondary h-2 rounded-md"
                      />
                    )}
                    {holidays.length > 0 && (
                      <div
                        key={daySwaps[0].id}
                        className="bg-accent h-2 rounded-md"
                      />
                    )}
                  </>
                );
              })}
            </>
          ) : (
            <>
              {events.slice(0, CALENDAR_MAX_EVENTS_PER_DAY).map((event) => (
                <div key={event.id} className="bg-primary h-2 rounded-md" />
              ))}
            </>
          )}
        </div>
      </Button>

      <AllEventsModal
        resource={resource}
        clickable={clickable}
        events={events}
        day={day}
        month={today.month}
        year={today.year}
        isOpen={isAllEventsModalOpen}
        onOpenChange={setIsAllEventsModalOpen}
      />
    </>
  );
}
