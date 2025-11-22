"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useArfSheet } from "@/features/abstract-resource-form";
import { declineNumeric } from "@/features/polish";
import {
  CreateButton,
  OpenCreateSheetButton,
  Resource,
} from "@/features/resources";
import type { ResourceFormProps } from "@/types/components";
import { getRoundedDate } from "@/utils";

import type { MappedCalendarData } from "../types/internal";
import { findParentSemesterForDate } from "../utils/find-parent-semester-for-date";
import { hasSemesterEventsForDay } from "../utils/has-semester-events-for-day";

export function AllEventsModal({
  clickable,
  clickedDay,
  mappedData,
  isOpen,
  onClose,
}: {
  clickable: boolean;
  clickedDay: string | null;
  mappedData: MappedCalendarData;
  isOpen: boolean;
  onClose: () => void;
}) {
  const arfSheetDaySwap = useArfSheet(Resource.AcademicSemesters as Resource);
  const arfSheetHoliday = useArfSheet(Resource.AcademicSemesters as Resource);

  const daySwapFormProps = {
    resource: Resource.DaySwaps,
    className: "w-full px-4",
  } satisfies ResourceFormProps<Resource.DaySwaps>;
  const holidayFormProps = {
    resource: Resource.Holidays,
    className: "w-full px-4",
  } satisfies ResourceFormProps<Resource.Holidays>;

  const semesterEntries = Object.entries(mappedData.semesters);
  const totalSemesters = semesterEntries.length;

  if (clickedDay !== null) {
    const dayEvents = mappedData.dayEvents[clickedDay] ?? [];
    const totalEvents = dayEvents.length;
    const parentSemester = findParentSemesterForDate(clickedDay, mappedData);

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
              {hasSemesterEventsForDay(clickedDay, mappedData) ? (
                <section>
                  {parentSemester !== null && (
                    <div className="flex gap-2">
                      <OpenCreateSheetButton
                        sheet={arfSheetDaySwap}
                        formProps={daySwapFormProps}
                        resource={Resource.DaySwaps}
                        parentResourceData={parentSemester.semester}
                      />
                      <OpenCreateSheetButton
                        sheet={arfSheetHoliday}
                        formProps={holidayFormProps}
                        resource={Resource.Holidays}
                        parentResourceData={parentSemester.semester}
                      />
                    </div>
                  )}
                </section>
              ) : (
                <CreateButton
                  resource={Resource.CalendarEvents}
                  prefillAttributes={{
                    startTime: getRoundedDate(8, clickedDay),
                    endTime: getRoundedDate(20, clickedDay),
                  }}
                  plural
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
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
            {semesterEntries.map(([semesterId, semesterStructure]) => (
              <div key={semesterId}>{semesterStructure.semesterCard}</div>
            ))}
          </div>
          {clickable ? (
            <CreateButton resource={Resource.AcademicSemesters} />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
