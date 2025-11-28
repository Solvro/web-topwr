"use client";

import type { ReactNode } from "react";

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useArfSheet } from "@/features/abstract-resource-form";
import { declineNumeric } from "@/features/polish";
import {
  CreateButton,
  CreateButtonLabel,
  OpenCreateSheetButton,
  RelationType,
  Resource,
  getResourceRelationDefinitions,
} from "@/features/resources";
import type { ResourceRelation } from "@/features/resources/types";
import type { ResourceFormProps } from "@/types/components";
import { getRoundedDate } from "@/utils";

import type {
  EventCardType,
  MappedCalendarData,
  SemesterStructure,
} from "../types/internal";
import { findParentSemesterForDate } from "../utils/find-parent-semester-for-date";
import { GenericModal } from "./arc-modal";

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
  const relatedResources = Object.entries(relationDefinitions).filter(
    ([_, definition]) => definition.type === RelationType.OneToMany,
  );

  const relatedResourceFormProps = relatedResources.map(
    ([relatedResource]) => ({
      resource: relatedResource,
      formProps: {
        resource: relatedResource as ResourceRelation<Resource>,
        className: "w-full px-4",
      } satisfies ResourceFormProps<Resource>,
    }),
  );

  const semesterEntries = Object.entries(mappedData.semesters);
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
    <GenericModal isOpen={isOpen} onClose={onClose}>
      {clickedDay === null ? (
        <>
          <DialogHeader>
            <DialogTitle>Kalendarze akademickie</DialogTitle>
            <DialogDescription>
              {totalSemesters === 0
                ? "Brak kalendarzy akademickich"
                : `Znaleziono ${declineNumeric(totalSemesters, "semestr akademicki", "semestry akademickie", "semestrów akademickich")}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex max-h-[50svh] flex-col gap-2 overflow-y-auto">
              {semesterEntries.map(([_, semesterStructure]): EventCardType => {
                return semesterStructure.semesterCard;
              })}
            </div>
            {clickable ? (
              <CreateButton resource={Resource.AcademicSemesters} />
            ) : null}
          </div>
        </>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>Wydarzenia {clickedDay}</DialogTitle>
            <DialogDescription>
              {totalEvents === 0
                ? "Brak wydarzeń zaplanowanych na ten dzień"
                : `W tym dniu zaplanowano ${declineNumeric(totalEvents, "wydarzenie", "wydarzenia", "wydarzeń")}.`}
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
                        ({ resource: relatedResource, formProps }) => (
                          <OpenCreateSheetButton
                            key={relatedResource}
                            sheet={arfSheet}
                            formProps={formProps}
                            resource={
                              relatedResource as ResourceRelation<Resource>
                            }
                            parentResourceData={parentSemester.semester}
                          >
                            <CreateButtonLabel
                              resource={relatedResource as Resource}
                            />
                          </OpenCreateSheetButton>
                        ),
                      )}
                    </div>
                  )}
                </section>
              )}
            </div>
          </div>
        </>
      )}
    </GenericModal>
  );
}
