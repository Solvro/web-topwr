"use client";

import { Calendar } from "lucide-react";
import { useContext } from "react";

import { Button } from "@/components/ui/button";
import { GrammaticalCase, declineNoun } from "@/features/polish";
import type { Resource } from "@/features/resources";

import { CalendarModalContext } from "../context/calendar-modal-context";

export function AcademicSemesterListButton({
  resource,
}: {
  resource: Resource;
}) {
  const { openSemesters } = useContext(CalendarModalContext);

  return (
    <Button
      onClick={() => {
        openSemesters();
      }}
      variant="default"
      className="mt-4 self-end"
    >
      <Calendar />
      Konfiguruj{" "}
      {declineNoun(resource, {
        case: GrammaticalCase.Nominative,
        plural: true,
      })}
    </Button>
  );
}
