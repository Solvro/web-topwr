"use client";

import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useArfSheet } from "@/features/abstract-resource-form";
import type { ArfSheetFormProps } from "@/features/abstract-resource-form/types";
import {
  CreateButton,
  CreateButtonLabel,
  OpenCreateSheetButton,
  RelationType,
  Resource,
  getResourceRelationDefinitions,
} from "@/features/resources";
import type {
  ResourceDefaultValues,
  ResourceFormValues,
  ResourceRelation,
} from "@/features/resources/types";
import { getRoundedDate, typedEntries } from "@/utils";

import type {
  EventCardType,
  MappedCalendarData,
  SemesterStructure,
} from "../types/internal";
import { findExistingDaySwap } from "../utils/find-existing-day-swap";
import { findParentSemesterForDate } from "../utils/find-parent-semester-for-date";
import { getModalDescription } from "../utils/get-modal-description";
import { getModalHeader } from "../utils/get-modal-header";

export function AllEventsModal({
  resource,
  clickable,
  clickedDay,
  mappedData,
  isOpen,
  onClose,
}: {
  resource: Resource;
  clickable: boolean;
  clickedDay: string | null;
  mappedData: MappedCalendarData;
  isOpen: boolean;
  onClose: () => void;
}) {
  const arfSheet = useArfSheet(resource);

  const relationDefinitions = getResourceRelationDefinitions(resource);
  const relatedResourceFormProps = typedEntries(relationDefinitions).reduce<
    {
      resource: keyof typeof relationDefinitions;
      formProps: ArfSheetFormProps<ResourceRelation<Resource>>;
    }[]
  >((accumulator, [relatedResource, definition]) => {
    if (definition.type === RelationType.OneToMany) {
      let formProps: ArfSheetFormProps<ResourceRelation<Resource>>;

      if (definition.dateFields !== undefined && clickedDay !== null) {
        const defaultValues: Partial<
          Record<keyof ResourceFormValues<ResourceRelation<Resource>>, string>
        > = {};
        for (const field of definition.dateFields) {
          (defaultValues as Record<string, string>)[field as string] =
            clickedDay;
        }
        formProps = {
          resource: relatedResource,
          className: "w-full px-4",
          defaultValues: defaultValues as ResourceDefaultValues<
            ResourceRelation<Resource>
          >,
        };
      } else {
        formProps = {
          resource: relatedResource,
          className: "w-full px-4",
        };
      }

      accumulator.push({
        resource: relatedResource,
        formProps,
      });
    }
    return accumulator;
  }, []);

  const semesterEntries = typedEntries(mappedData.semesters);
  const totalSemesters = semesterEntries.length;
  let totalEvents = 0;
  let parentSemester: SemesterStructure | null = null;
  let dayEvents: ReactNode[] = [];

  if (clickedDay !== null) {
    dayEvents = mappedData.dayEvents[clickedDay] ?? [];
    totalEvents = dayEvents.length;
    parentSemester = findParentSemesterForDate(clickedDay, mappedData);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="h-max max-h-[80vh] max-w-lg"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        {clickedDay === null ? (
          <>
            <DialogHeader>
              <DialogTitle>{getModalHeader(resource, clickedDay)}</DialogTitle>
              <DialogDescription>
                {getModalDescription(
                  resource,
                  clickedDay,
                  totalSemesters,
                  mappedData,
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex max-h-[50svh] flex-col gap-2 overflow-y-auto">
                {semesterEntries.map(
                  ([_, semesterStructure]): EventCardType =>
                    semesterStructure.semesterCard,
                )}
              </div>
              {clickable ? (
                <CreateButton resource={Resource.AcademicSemesters} />
              ) : null}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{getModalHeader(resource, clickedDay)}</DialogTitle>
              <DialogDescription>
                {getModalDescription(
                  resource,
                  clickedDay,
                  totalEvents,
                  mappedData,
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex max-h-[50svh] flex-col gap-2 overflow-y-auto">
                {dayEvents}
              </div>
              <div className="flex flex-col gap-2">
                {semesterEntries.length === 0 ? (
                  <CreateButton
                    resource={Resource.CalendarEvents}
                    prefillAttributes={{
                      startTime: getRoundedDate(8, clickedDay),
                      endTime: getRoundedDate(20, clickedDay),
                    }}
                    plural
                  />
                ) : (
                  <section>
                    {parentSemester == null ? (
                      <p className="text-sm font-bold">
                        Stwórz najpierw semestr akademicki, aby móc dodać zmiany
                        dni i święta
                      </p>
                    ) : (
                      <div className="flex gap-2">
                        {relatedResourceFormProps.map(
                          ({ resource: relatedResource, formProps }) => {
                            const daySwapExists = findExistingDaySwap(
                              clickedDay,
                              parentSemester,
                            );
                            return (
                              <OpenCreateSheetButton
                                key={relatedResource}
                                sheet={arfSheet}
                                formProps={formProps}
                                resource={relatedResource}
                                parentResourceData={parentSemester.semester}
                                restrictToOne={
                                  relatedResource === Resource.DaySwaps &&
                                  daySwapExists
                                }
                              >
                                <CreateButtonLabel resource={relatedResource} />
                              </OpenCreateSheetButton>
                            );
                          },
                        )}
                      </div>
                    )}
                  </section>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
