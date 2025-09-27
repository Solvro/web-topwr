import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/calendar";

interface Props {
  event: CalendarEvent;
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

export function EventBlock({ event, onClick, className }: Props) {
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

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "w-full cursor-pointer rounded bg-blue-100 px-1 py-0.5 text-left text-xs text-blue-800 hover:bg-blue-200 sm:text-xs",
        className,
      )}
      title={event.name} // Show full name on hover
    >
      <span className="sm:hidden">{truncateName(event.name)}</span>
      <span className="hidden sm:inline">{truncateName(event.name)}</span>
    </div>
  );
}
