import { Edit } from "lucide-react";
import Link from "next/link";
import type { KeyboardEvent, MouseEvent } from "react";

import { Resource } from "@/config/enums";
import type { CalendarEventTypes } from "@/config/enums";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/calendar";

import { DeleteButtonWithDialog } from "../delete-button-with-dialog";

interface Props {
  event: CalendarEvent;
  clickable: boolean;
  resource: CalendarEventTypes;
  onClick: (event: CalendarEvent) => void;
  className?: string;
}

function truncateName(name: string) {
  const maxLength = 8;
  if (name.length <= maxLength) {
    return name;
  }
  return `${name.slice(0, maxLength)}...`;
}

export function EventBlock({
  event,
  clickable,
  resource,
  onClick,
  className,
}: Props) {
  function handleClick(clickEvent: MouseEvent) {
    clickEvent.stopPropagation();
    onClick(event);
  }

  function handleKeyDown(keyEvent: KeyboardEvent) {
    if (keyEvent.key === "Enter" || keyEvent.key === " ") {
      keyEvent.preventDefault();
      keyEvent.stopPropagation();
      onClick(event);
    }
  }

  const content = (
    <>
      <span className="sm:hidden">{truncateName(event.name)}</span>
      <span className="hidden sm:inline">{truncateName(event.name)}</span>
    </>
  );

  return clickable ? (
    <div
      className={cn(
        "w-full cursor-pointer rounded bg-blue-100 px-1 py-0.5 text-left text-xs text-blue-800 hover:bg-blue-200 sm:text-xs",
        className,
      )}
    >
      <div className="flex w-full">
        {content}
        <div className="ml-auto flex">
          <Link href={`/${resource}/edit/${event.id}`}>
            <Edit size={16} />
          </Link>
          <DeleteButtonWithDialog
            resource={Resource.CalendarEvents}
            id={event.id}
          />
        </div>
      </div>
    </div>
  ) : (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "w-full cursor-pointer rounded bg-blue-100 px-1 py-0.5 text-left text-xs text-blue-800 hover:bg-blue-200 sm:text-xs",
        className,
      )}
      title={event.name}
    >
      {content}
    </div>
  );
}
