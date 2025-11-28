"use client";

import { Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GrammaticalCase, declineNoun } from "@/features/polish";
import type { Resource } from "@/features/resources";

import { useCalendarModal } from "../hooks/use-calendar-modal";

export function AcademicSemesterListButton({
  resource,
}: {
  resource: Resource;
}) {
  const { openSemesters } = useCalendarModal();

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
