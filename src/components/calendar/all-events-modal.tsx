import { formatDate, isSameDay } from "date-fns";
import { pl } from "date-fns/locale";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeclensionCase, Resource } from "@/config/enums";
import { renderAbstractResourceForm } from "@/lib/actions";
import { getResourceRelationDefinitions } from "@/lib/helpers/app";
import { typedEntries } from "@/lib/helpers/typescript";
import { declineNoun } from "@/lib/polish";
import { cn } from "@/lib/utils";
import type { GetResourceWithRelationsResponse } from "@/types/api";
import type { CreatableResource, ResourceDataType } from "@/types/app";
import type {
  ResourceFormSheetData,
  ResourceFormSheetDataContent,
} from "@/types/components";

import { CreateButton } from "../abstract/create-button";
import { DeleteButtonWithDialog } from "../abstract/delete-button-with-dialog";
import { EditButton } from "../abstract/edit-button";
import { AbstractResourceFormSheet } from "../abstract/resource-form/sheet";

function extractStartDate(event: ResourceDataType<Resource>): Date | null {
  const startFields = [
    "startTime",
    "startDate",
    "semesterStartDate",
    "visibleFrom",
    "start",
    "date",
    "beginDate",
  ];

  for (const field of startFields) {
    const value = event[field as keyof ResourceDataType<Resource>];
    try {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    } catch {
      continue;
    }
  }

  return null;
}

function extractEndDate(event: ResourceDataType<Resource>): Date | null {
  const endFields = [
    "endTime",
    "endDate",
    "examSessionLastDate",
    "visibleUntil",
    "end",
    "endDate",
    "finishDate",
  ];

  for (const field of endFields) {
    const value = event[field as keyof ResourceDataType<Resource>];
    try {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    } catch {
      continue;
    }
  }
  return null;
}

function extractEventName(event: ResourceDataType<Resource>): string {
  const nameFields = ["name", "title", "summary", "eventName"];

  for (const field of nameFields) {
    const value = event[field as keyof ResourceDataType<Resource>];
    if (typeof value === "string") {
      return value.trim();
    }
  }

  return "";
}

function extractEventDescription(
  event: ResourceDataType<Resource>,
): string | undefined {
  const descFields = ["description", "details", "notes", "content", "summary"];

  for (const field of descFields) {
    const value = event[field as keyof ResourceDataType<Resource>];
    if (typeof value === "string") {
      return value.trim();
    }
  }

  return undefined;
}

const formatTime = (startDate: Date, endDate: Date, isStart: boolean) =>
  formatDate(
    isStart ? startDate : endDate,
    isSameDay(startDate, endDate) ? "HH:mm" : "HH:mm (E)",
    { locale: pl },
  );

export function AllEventsModal<T extends CreatableResource>({
  resource,
  events,
  day,
  month,
  year,
  clickable,
  isOpen,
  onOpenChange,
}: {
  resource: T;
  events: GetResourceWithRelationsResponse<T>["data"][];
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

  function showSheet(
    options: Omit<ResourceFormSheetDataContent<T>, "form">,
    ...formProps: Parameters<typeof renderAbstractResourceForm>
  ) {
    const formPromise = renderAbstractResourceForm(...formProps);
    setSheet({ visible: true, content: { ...options, form: formPromise } });
  }

  const resourceRelation = typedEntries(
    getResourceRelationDefinitions(resource),
  );

  console.warn(resourceRelation);

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
            {resource === Resource.AcademicSemesters ? (
              <span>
                {events.length === 0
                  ? "Brak zmian dni akademickich lub świąt w tym dniu"
                  : "Wszystkie zmiany dni i święta zaplanowane na ten dzień"}
              </span>
            ) : (
              <span>
                {events.length === 0
                  ? "Brak wydarzeń zaplanowanych na ten dzień"
                  : "Wszystkie wydarzenia zaplanowane na ten dzień"}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-end gap-2">
          {events.map((event) => {
            const startDate = extractStartDate(event);
            const endDate = extractEndDate(event);
            const eventName = extractEventName(event);
            const eventDescription = extractEventDescription(event);

            return (
              <div
                key={event.id}
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
                    <EditButton resource={resource} id={event.id} />
                    <DeleteButtonWithDialog
                      resource={resource}
                      itemName={eventName}
                      id={event.id}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
          {clickable ? (
            <div>
              {resource === Resource.AcademicSemesters ? (
                <>
                  <CreateButton
                    className="mt-4 mr-2"
                    resource={Resource.DaySwaps}
                    prefillAttributes={{}}
                    asSheet
                    onClick={() => {
                      showSheet(
                        {
                          item: null,
                          childResource: resourceRelation[0][0],
                          parentResourceData: events[0] as ResourceDataType<T>,
                        },
                        {
                          resource: Resource.DaySwaps,
                          ...events[0].daySwaps[0],
                        },
                      );
                    }}
                  />
                  <AbstractResourceFormSheet
                    resource={resource}
                    sheet={sheet}
                    setSheet={setSheet}
                  />
                  <CreateButton className="mt-4" resource={Resource.Holidays} />
                </>
              ) : (
                <CreateButton className="mt-4" resource={resource} />
              )}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
