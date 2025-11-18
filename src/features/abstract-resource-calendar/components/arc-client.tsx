"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import type { SearchParameters } from "@/types/components";

import { CalendarModalContext } from "../context/calendar-modal-context";
import type {
  CalendarModalContextValue,
  MappedCalendarData,
} from "../types/internal";
import { AllEventsModal } from "./arc-all-events-modal";
import { Calendar } from "./arc-calendar";
import type { Resource } from "@/features/resources";
import { ArfSheetProvider } from "@/features/abstract-resource-form";

export function AbstractResourceCalendarInternal({
  resource,
  children,
  searchParams,
  clickable,
  mappedData,
}: {
  resource: Resource;
  children: ReactNode;
  searchParams: SearchParameters;
  mappedData: MappedCalendarData;
  clickable: boolean;
}) {
  const [clickedDay, setClickedDay] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenSemesters = () => {
    setClickedDay(null);
    setIsModalOpen(true);
  };

  const handleOpenDayEvents = (dayKey: string) => {
    setClickedDay(dayKey);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setClickedDay(null);
    }, 300);
  };

  const contextValue: CalendarModalContextValue = {
    openSemesters: handleOpenSemesters,
  };

  return (
    <ArfSheetProvider resource={resource}>
      <CalendarModalContext.Provider value={contextValue}>
        <Calendar
          searchParams={searchParams}
          mappedData={mappedData}
          clickable={clickable}
          onDayClick={handleOpenDayEvents}
        />
        {children}
        <AllEventsModal
          clickable={clickable}
          clickedDay={clickedDay}
          mappedData={mappedData}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </CalendarModalContext.Provider>
    </ArfSheetProvider>
  );
}
