import type { KeyboardEvent, MouseEvent } from "react";
import { useState } from "react";

import type { GetResourceWithRelationsResponse } from "@/types/api";
import type { RoutableResource } from "@/types/app";

import { Button } from "../ui/button";
import { AllEventsModal } from "./all-events-modal";

export function AcademicSemesterListButton({
  resource,
  events,
  clickable,
}: {
  events: GetResourceWithRelationsResponse<RoutableResource>["data"][];
  resource: RoutableResource;
  clickable: boolean;
}) {
  const [isAllEventsModalOpen, setIsAllEventsModalOpen] = useState(false);

  function handleDayClick(clickEvent: MouseEvent) {
    clickEvent.stopPropagation();
    setIsAllEventsModalOpen(true);
  }

  function handleDayKeyDown(keyEvent: KeyboardEvent) {
    if (keyEvent.key === "Enter" || keyEvent.key === " ") {
      keyEvent.preventDefault();
      keyEvent.stopPropagation();
      setIsAllEventsModalOpen(true);
    }
  }
  return (
    <>
      <Button
        variant="default"
        onClick={handleDayClick}
        onKeyDown={handleDayKeyDown}
      >
        Konfiguruj
      </Button>
      <AllEventsModal
        resource={resource}
        events={events}
        clickable={clickable}
        isOpen={isAllEventsModalOpen}
        onOpenChange={setIsAllEventsModalOpen}
      />
    </>
  );
}
