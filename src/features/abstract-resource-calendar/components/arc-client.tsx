"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { BackToHomeButton } from "@/components/presentation/back-to-home-button";
import { ArfSheetProvider } from "@/features/abstract-resource-form";
import type { Resource } from "@/features/resources";
import type { SearchParameters } from "@/types/components";

import { CalendarModalContext } from "../context/calendar-modal-context";
import type { MappedCalendarData } from "../types/internal";
import { AllEventsModal } from "./arc-all-events-modal";
import { CalendarInternal } from "./arc-internal";

export function AbstractResourceCalendarClient({
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

  return (
    <ArfSheetProvider resource={resource}>
      <CalendarModalContext.Provider
        value={{ openSemesters: handleOpenSemesters }}
      >
        <CalendarInternal
          searchParams={searchParams}
          mappedData={mappedData}
          clickable={clickable}
          onDayClick={handleOpenDayEvents}
        />
        {children}
        <AllEventsModal
          resource={resource}
          clickable={clickable}
          clickedDay={clickedDay}
          mappedData={mappedData}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
        <div className="fixed bottom-4 left-4">
          <BackToHomeButton />
        </div>
      </CalendarModalContext.Provider>
    </ArfSheetProvider>
  );
}
