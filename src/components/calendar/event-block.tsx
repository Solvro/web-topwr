import Link from "next/link";

// Add this import
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/calendar";

interface Props {
  event: CalendarEvent;
  clickable: boolean;
  resource: string;
  onClick: (event: CalendarEvent) => void;
  className?: string;
}

const truncateName = (name: string) => {
  const maxLength = 8;
  if (name.length <= maxLength) {
    return name;
  }
  return `${name.slice(0, maxLength)}...`;
};

export function EventBlock({
  event,
  clickable,
  resource,
  onClick,
  className,
}: Props) {
  const handleClick = (clickEvent: React.MouseEvent) => {
    clickEvent.stopPropagation();
    onClick(event);
  };

  const handleKeyDown = (keyEvent: React.KeyboardEvent) => {
    if (keyEvent.key === "Enter" || keyEvent.key === " ") {
      keyEvent.preventDefault();
      keyEvent.stopPropagation();
      onClick(event);
    }
  };

  const content = (
    <>
      <span className="sm:hidden">{truncateName(event.name)}</span>
      <span className="hidden sm:inline">{truncateName(event.name)}</span>
    </>
  );

  return clickable && resource ? (
    <Link
      href={`/${resource}/edit/${event.id}`}
      className={cn(
        "w-full cursor-pointer rounded bg-blue-100 px-1 py-0.5 text-left text-xs text-blue-800 hover:bg-blue-200 sm:text-xs",
        className,
      )}
      title={event.name}
      onClick={handleClick}
    >
      {content}
    </Link>
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
