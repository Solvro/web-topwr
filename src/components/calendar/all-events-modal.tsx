"use client";

import { formatDate, isSameDay, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import { SquarePen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeclensionCase, Resource } from "@/config/enums";
import { tryParseNumber } from "@/lib/helpers";
import {
  getResourceMetadata,
  getResourceRelationDefinitions,
} from "@/lib/helpers/app";
import {
  extractEndDate,
  extractEventDescription,
  extractEventName,
  extractStartDate,
  formatDaySwapEventName,
  formatHolidayDateRange,
  formatSingleDate,
  isDateInRange,
  isSameDate,
} from "@/lib/helpers/calendar";
import type { DaySpecificEvent } from "@/lib/helpers/calendar";
import { declineNoun } from "@/lib/polish";
import { cn } from "@/lib/utils";
import type { GetResourceWithRelationsResponse } from "@/types/api";
import type {
  ResourceDataType,
  ResourceDefaultValues,
  ResourceFormValues,
  ResourceRelation,
  RoutableResource,
} from "@/types/app";
import type {
  ExistingImages,
  ResourceFormSheetData,
  ResourceFormSheetDataContent,
  ResourceRelations,
} from "@/types/components";

import { typedEntries } from "../../lib/helpers/typescript";
import { CreateButton } from "../abstract/create-button";
import { EditButton } from "../abstract/edit-button";
import { AbstractResourceFormInternal } from "../abstract/resource-form/client";
import { AbstractResourceFormSheet } from "../abstract/resource-form/sheet";
import { DeleteButtonWithDialog } from "../delete-button-with-dialog";

function formatTime(startDate: Date, endDate: Date, isStart: boolean) {
  return formatDate(
    isStart ? startDate : endDate,
    isSameDay(startDate, endDate) ? "HH:mm" : "HH:mm (E)",
    { locale: pl },
  );
}

function isAcademicSemesterWithDaySwaps(
  semester: unknown,
): semester is { daySwaps: ResourceDataType<Resource.DaySwaps>[] } {
  return (
    typeof semester === "object" &&
    semester !== null &&
    "daySwaps" in semester &&
    Array.isArray((semester as { daySwaps: unknown }).daySwaps)
  );
}

function isAcademicSemesterWithHolidays(
  semester: unknown,
): semester is { holidays: ResourceDataType<Resource.Holidays>[] } {
  return (
    typeof semester === "object" &&
    semester !== null &&
    "holidays" in semester &&
    Array.isArray((semester as { holidays: unknown }).holidays)
  );
}

function HolidayEventCard<T extends RoutableResource>({
  holidayEvent,
  clickable,
  showSheet,
}: {
  holidayEvent: ResourceDataType<Resource.Holidays> & {
    __type: "holiday";
    __parentSemester: GetResourceWithRelationsResponse<T>["data"];
  };
  clickable: boolean;
  showSheet: (
    options: Omit<ResourceFormSheetDataContent<T>, "form">,
    formProps: {
      resource: Resource;
      defaultValues: ResourceDefaultValues<Resource>;
    },
  ) => void;
}) {
  const eventName = holidayEvent.description;
  const eventDate = formatHolidayDateRange(
    parseISO(holidayEvent.startDate),
    parseISO(holidayEvent.lastDate),
  );

  return (
    <div
      key={holidayEvent.id}
      className="bg-accent flex h-max w-full justify-between rounded-md p-3 text-left text-sm"
      title={eventName}
    >
      <div className="my-auto">
        <div className="font-medium">{eventName}</div>
        <div className="mt-1 text-xs">{eventDate}</div>
      </div>
      {clickable ? (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="h-10 w-10"
            onClick={() => {
              showSheet(
                {
                  item: {
                    id: holidayEvent.id,
                    name: holidayEvent.description,
                  },
                  childResource: Resource.Holidays as ResourceRelation<T>,
                  parentResourceData:
                    holidayEvent.__parentSemester as ResourceDataType<T>,
                },
                {
                  resource: Resource.Holidays as Resource,
                  defaultValues:
                    holidayEvent as ResourceDefaultValues<Resource>,
                },
              );
            }}
          >
            <SquarePen />
          </Button>
          <DeleteButtonWithDialog
            resource={Resource.Holidays}
            itemName={eventName}
            id={holidayEvent.id}
          />
        </div>
      ) : null}
    </div>
  );
}

function DaySwapEventCard<T extends RoutableResource>({
  daySwapEvent,
  clickable,
  showSheet,
}: {
  daySwapEvent: ResourceDataType<Resource.DaySwaps> & {
    __type: "daySwap";
    __parentSemester: GetResourceWithRelationsResponse<T>["data"];
  };
  clickable: boolean;
  showSheet: (
    options: Omit<ResourceFormSheetDataContent<T>, "form">,
    formProps: {
      resource: Resource;
      defaultValues: ResourceDefaultValues<Resource>;
    },
  ) => void;
}) {
  const eventDate = parseISO(daySwapEvent.date);
  const eventName = formatDaySwapEventName(eventDate);
  const eventDateString = formatSingleDate(eventDate);

  return (
    <div
      key={daySwapEvent.id}
      className="bg-accent flex h-max w-full justify-between rounded-md p-3 text-left text-sm"
      title={eventName}
    >
      <div className="my-auto">
        <div className="font-medium">{eventName}</div>
        <div className="mt-1 text-xs">{eventDateString}</div>
      </div>
      {clickable ? (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="h-10 w-10"
            onClick={() => {
              showSheet(
                {
                  item: {
                    id: daySwapEvent.id,
                    name: formatDate(
                      parseISO(daySwapEvent.date),
                      "d MMMM yyyy",
                      { locale: pl },
                    ),
                  },
                  childResource: Resource.DaySwaps as ResourceRelation<T>,
                  parentResourceData:
                    daySwapEvent.__parentSemester as ResourceDataType<T>,
                },
                {
                  resource: Resource.DaySwaps as Resource,
                  defaultValues:
                    daySwapEvent as ResourceDefaultValues<Resource>,
                },
              );
            }}
          >
            <SquarePen />
          </Button>
          <DeleteButtonWithDialog
            resource={Resource.DaySwaps}
            itemName={eventName}
            id={daySwapEvent.id}
          />
        </div>
      ) : null}
    </div>
  );
}

export function AllEventsModal<T extends RoutableResource>({
  resource,
  events,
  allEvents = [],
  day,
  month,
  year,
  clickable,
  isOpen,
  onOpenChange,
}: {
  resource: T;
  events: GetResourceWithRelationsResponse<T>["data"][];
  allEvents?: GetResourceWithRelationsResponse<T>["data"][];
  day?: number;
  month?: { name: string; value: number };
  year?: number;
  clickable: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [sheet, setSheet] = useState<ResourceFormSheetData<T>>({
    visible: false,
  });

  let baseDate = null;
  if (month !== undefined && year !== undefined) {
    baseDate = new Date(year, month.value - 1, day);
  }

  const getDaySpecificEvents = ():
    | DaySpecificEvent<T>[]
    | GetResourceWithRelationsResponse<T>["data"][] => {
    if (resource !== Resource.AcademicSemesters) {
      return events;
    }

    if (baseDate === null) {
      return events;
    }

    const daySpecificEvents: DaySpecificEvent<T>[] = [];

    const sourceEvents = allEvents.length > 0 ? allEvents : events;

    for (const semester of sourceEvents) {
      try {
        if (isAcademicSemesterWithDaySwaps(semester)) {
          for (const daySwap of semester.daySwaps) {
            try {
              const daySwapDate = parseISO(daySwap.date);
              if (isSameDate(baseDate, daySwapDate)) {
                daySpecificEvents.push({
                  ...daySwap,
                  __type: "daySwap",
                  __parentSemester: semester,
                } as DaySpecificEvent<T>);
              }
            } catch {
              toast.error("Błąd podczas przetwarzania zamiany dni");
            }
          }
        }

        if (isAcademicSemesterWithHolidays(semester)) {
          for (const holiday of semester.holidays) {
            try {
              const holidayStartDate = parseISO(holiday.startDate);
              let holidayEndDate = holidayStartDate;

              if (holiday.lastDate) {
                holidayEndDate = parseISO(holiday.lastDate);
              }

              if (isDateInRange(baseDate, holidayStartDate, holidayEndDate)) {
                daySpecificEvents.push({
                  ...holiday,
                  __type: "holiday",
                  __parentSemester: semester,
                } as DaySpecificEvent<T>);
              }
            } catch {
              toast.error("Błąd podczas przetwarzania świąt");
            }
          }
        }
      } catch {
        toast.error("Błąd podczas przetwarzania wydarzeń semestru");
      }
    }

    return daySpecificEvents;
  };

  const displayEvents = getDaySpecificEvents();

  function showSheet(
    options: Omit<ResourceFormSheetDataContent<T>, "form">,
    formProps: {
      resource: Resource;
      defaultValues: ResourceDefaultValues<Resource>;
    },
  ) {
    const form = (
      <AbstractResourceFormInternal
        resource={formProps.resource}
        defaultValues={formProps.defaultValues}
        existingImages={{} as ExistingImages<Resource>}
        relatedResources={{} as ResourceRelations<Resource>}
        isEmbedded
      />
    );
    setSheet({ visible: true, content: { ...options, form } });
  }

  const resourceRelation = typedEntries(
    getResourceRelationDefinitions(resource),
  );

  function findParentResourceForDate(
    targetDay: number,
    targetMonth: { name: string; value: number },
    targetYear: number,
  ) {
    const selectedDate = new Date(targetYear, targetMonth.value - 1, targetDay);

    if (resourceRelation.length > 0) {
      for (const event of allEvents) {
        const startDate = extractStartDate(event);
        const endDate = extractEndDate(event);

        if (startDate !== null && endDate !== null) {
          if (selectedDate >= startDate && selectedDate <= endDate) {
            return event;
          }
        } else if (startDate !== null && selectedDate >= startDate) {
          return event;
        }
      }
    }

    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-max max-h-[80vh] max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {baseDate == null ? (
              <>
                {declineNoun(resource, {
                  case: DeclensionCase.Nominative,
                  plural: true,
                })}
              </>
            ) : (
              <>
                Wydarzenia {formatDate(baseDate, "d MMMM yyyy", { locale: pl })}
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {baseDate === null && resource === Resource.AcademicSemesters ? (
              <span>
                {displayEvents.length === 0
                  ? "Brak semestrów akademickich"
                  : "Wszystkie semestry akademickie"}
              </span>
            ) : resourceRelation.length > 0 ? (
              <span>
                {displayEvents.length === 0
                  ? "Brak zmian dni akademickich lub świąt w tym dniu"
                  : "Wszystkie zmiany dni i święta zaplanowane na ten dzień"}
              </span>
            ) : (
              <span>
                {displayEvents.length === 0
                  ? "Brak wydarzeń zaplanowanych na ten dzień"
                  : "Wszystkie wydarzenia zaplanowane na ten dzień"}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-end gap-2">
          {displayEvents.map((event) => {
            if (resource === Resource.AcademicSemesters && "__type" in event) {
              switch (event.__type) {
                case "holiday": {
                  const holidayEvent =
                    event as ResourceDataType<Resource.Holidays> & {
                      __type: "holiday";
                      __parentSemester: GetResourceWithRelationsResponse<T>["data"];
                    };

                  return (
                    <HolidayEventCard
                      key={holidayEvent.id}
                      holidayEvent={holidayEvent}
                      clickable={clickable}
                      showSheet={showSheet}
                    />
                  );
                }

                case "daySwap": {
                  const daySwapEvent =
                    event as ResourceDataType<Resource.DaySwaps> & {
                      __type: "daySwap";
                      __parentSemester: GetResourceWithRelationsResponse<T>["data"];
                    };

                  return (
                    <DaySwapEventCard
                      key={daySwapEvent.id}
                      daySwapEvent={daySwapEvent}
                      clickable={clickable}
                      showSheet={showSheet}
                    />
                  );
                }

                default: {
                  return null;
                }
              }
            }

            const regularEvent =
              event as GetResourceWithRelationsResponse<T>["data"];
            const startDate = extractStartDate(regularEvent);
            const endDate = extractEndDate(regularEvent);
            const eventName = extractEventName(regularEvent);
            const eventDescription = extractEventDescription(regularEvent);

            return (
              <div
                key={regularEvent.id}
                className="bg-accent flex h-max w-full justify-between rounded-md p-3 text-left text-sm"
                title={eventDescription ?? ""}
              >
                <div
                  className={cn(
                    resource === Resource.AcademicSemesters && "my-auto",
                  )}
                >
                  <div className="font-medium">{eventName}</div>
                  {resource !== Resource.AcademicSemesters &&
                    startDate != null &&
                    endDate != null && (
                      <div className="mt-1 text-xs">
                        {formatTime(startDate, endDate, true)}
                        {startDate.getTime() === endDate.getTime() ? (
                          ""
                        ) : (
                          <>—{formatTime(startDate, endDate, false)}</>
                        )}
                      </div>
                    )}
                </div>
                {clickable ? (
                  <div className="flex items-center">
                    <EditButton resource={resource} id={regularEvent.id} />
                    <DeleteButtonWithDialog
                      resource={resource}
                      itemName={eventName}
                      id={regularEvent.id}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
          {clickable ? (
            <div>
              {resourceRelation.length > 0 ? (
                <>
                  {resourceRelation.map(
                    ([childResource, relationDefinition], index) => (
                      <CreateButton
                        key={String(childResource)}
                        className={`mt-4${index < resourceRelation.length - 1 ? "mr-2" : ""}`}
                        resource={childResource as RoutableResource}
                        prefillAttributes={{}}
                        asSheet
                        onClick={() => {
                          if (
                            day === undefined ||
                            month === undefined ||
                            year === undefined
                          ) {
                            toast.error(
                              "Nie można utworzyć wydarzenia - brak informacji o dacie.",
                            );
                            return;
                          }

                          const parentResource = findParentResourceForDate(
                            day,
                            month,
                            year,
                          );

                          if (parentResource === null) {
                            toast.error(
                              `Nie znaleziono ${declineNoun(resource, { case: DeclensionCase.Genitive })} dla wybranej daty. Utwórz najpierw ${declineNoun(resource, { case: DeclensionCase.Accusative })}.`,
                            );
                            return;
                          }

                          function getDefaultValuesForResource(): ResourceFormValues<Resource> {
                            const resourceMetadata = getResourceMetadata(
                              childResource as Resource,
                            );
                            const baseDefaults = {
                              ...resourceMetadata.form.defaultValues,
                            } as Record<string, unknown>;

                            if (parentResource !== null) {
                              const foreignKey = String(
                                relationDefinition.foreignKey,
                              );
                              const parsedId = tryParseNumber(
                                String(parentResource.id),
                              );
                              baseDefaults[foreignKey] =
                                typeof parsedId === "number"
                                  ? parsedId
                                  : Number(parentResource.id);
                            }

                            if (
                              resourceMetadata.form.inputs.dateInputs != null &&
                              month !== undefined &&
                              day !== undefined
                            ) {
                              const dateMonth = String(month.value).padStart(
                                2,
                                "0",
                              );
                              const dateDay = String(day).padStart(2, "0");
                              const dateString = `${String(year)}-${dateMonth}-${dateDay}`;

                              for (const dateField of Object.keys(
                                resourceMetadata.form.inputs.dateInputs,
                              )) {
                                baseDefaults[dateField] = new Date(
                                  dateString,
                                ).toISOString();
                              }
                            }

                            return baseDefaults as ResourceFormValues<Resource>;
                          }

                          showSheet(
                            {
                              item: null,
                              childResource,
                              parentResourceData:
                                parentResource as ResourceDataType<T>,
                            },
                            {
                              resource: childResource as Resource,
                              defaultValues: getDefaultValuesForResource(),
                            },
                          );
                        }}
                      />
                    ),
                  )}
                </>
              ) : (
                <CreateButton
                  className="mt-4"
                  resource={resource}
                  prefillAttributes={{}}
                />
              )}
            </div>
          ) : null}
        </div>
      </DialogContent>
      <AbstractResourceFormSheet
        resource={resource}
        sheet={sheet}
        setSheet={setSheet}
      />
    </Dialog>
  );
}
