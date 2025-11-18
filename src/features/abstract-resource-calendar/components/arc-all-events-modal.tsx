"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { MappedCalendarData } from "../types/internal";
import { findParentSemesterForDate } from "../utils/find-parent-semester-for-date";
import { hasSemesterEventsForDay } from "../utils/has-semester-events-for-day";
import { OpenCreateSheetButton } from "./arc-open-create-sheet-button";
import { CreateButton, Resource } from "@/features/resources";
import { declineNumeric } from "@/features/polish";
import { getRoundedDate } from "@/utils";
import { useArfSheet } from "@/features/abstract-resource-form";

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
  const arfSheetHolidays = useArfSheet(Resource.AcademicSemesters);
  const arfSheetDaySwaps = useArfSheet(Resource.AcademicSemesters);

  if (clickedDay === null) {
    const semesterEntries = Object.entries(mappedData.semesters);
    const totalSemesters = semesterEntries.length;

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

  if (clickedDay) {
    const dayEvents = mappedData.dayEvents[clickedDay] ?? [];

    const totalEvents = dayEvents.length;

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
            {clickable ? (
              <div className="flex flex-col gap-2">
                {(() => {
                  if (hasSemesterEventsForDay(clickedDay, mappedData)) {
                    const parentSemester = findParentSemesterForDate(
                      clickedDay,
                      mappedData,
                    );
                    if (parentSemester === null) {
                      return null;
                    }
                    return (
                      <div className="flex gap-2">
                        <OpenCreateSheetButton
                          sheet={arfSheetHolidays}
                          resource={Resource.Holidays}
                          parentResourceData={parentSemester.semester}
                        />
                        <OpenCreateSheetButton
                          sheet={arfSheetDaySwaps}
                          resource={Resource.DaySwaps}
                          parentResourceData={parentSemester.semester}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <CreateButton
                        resource={Resource.CalendarEvents}
                        prefillAttributes={{
                          startTime: getRoundedDate(8, clickedDay),
                          endTime: getRoundedDate(20, clickedDay),
                        }}
                      />
                    );
                  }
                })()}
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
