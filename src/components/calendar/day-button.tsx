import { parseISO } from "date-fns";
import { useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";

import { Button } from "@/components/ui/button";
import { CALENDAR_MAX_EVENTS_PER_DAY } from "@/config/constants";
import { Resource } from "@/config/enums";
import { isDateInRange, isSameDate } from "@/lib/helpers/calendar";
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
  allEvents = [],
  currentDate,
}: {
  day: number;
  today: DateObject;
  clickable: boolean;
  resource: T;
  currentDate: Date;
  events?: GetResourceWithRelationsResponse<T>["data"][];
  allEvents?: GetResourceWithRelationsResponse<T>["data"][];
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
              {(() => {
                let hasDaySwap = false;
                let hasHoliday = false;

                try {
                  const dayDate = new Date(
                    today.year,
                    today.month.value - 1,
                    day,
                  );

                  for (const semester of allEvents) {
                    const daySwaps = semester.daySwaps;
                    if (daySwaps.length > 0) {
                      for (const daySwap of daySwaps) {
                        const daySwapDate = parseISO(daySwap.date);

                        if (isSameDate(dayDate, daySwapDate)) {
                          hasDaySwap = true;
                          break;
                        }
                      }
                    }

                    const holidays = semester.holidays;
                    if (holidays.length > 0) {
                      for (const holiday of holidays) {
                        const holidayStartDate = parseISO(holiday.startDate);
                        const holidayEndDate = holiday.lastDate
                          ? parseISO(holiday.lastDate)
                          : holidayStartDate;

                        if (
                          isDateInRange(
                            dayDate,
                            holidayStartDate,
                            holidayEndDate,
                          )
                        ) {
                          hasHoliday = true;
                          break;
                        }
                      }
                    }

                    if (hasDaySwap && hasHoliday) {
                      break;
                    }
                  }
                } catch (error) {
                  console.warn("Error checking day swaps and holidays:", error);
                }

                return (
                  <>
                    {hasDaySwap && (
                      <div className="bg-primary h-2 rounded-md" />
                    )}
                    {hasHoliday && (
                      <div className="bg-accent-foreground h-2 rounded-md" />
                    )}
                  </>
                );
              })()}
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
        allEvents={allEvents}
        day={day}
        month={today.month}
        year={today.year}
        isOpen={isAllEventsModalOpen}
        onOpenChange={setIsAllEventsModalOpen}
      />
    </>
  );
}
