import { cn } from "@/lib/utils";
import type { DateObject } from "@/types/calendar";

interface Props {
  day: number;
  today: DateObject;
  clickable: boolean;
  onDayClick?: (day: number) => void;
}

export function DayButton({ day, today, clickable, onDayClick }: Props) {
  const currentDate = new Date();
  const isCurrentDay =
    day === currentDate.getDate() &&
    today.month.value === currentDate.getMonth() + 1 &&
    today.year === currentDate.getFullYear();

  const handleClick = () => {
    if (clickable) {
      onDayClick?.(day);
    }
  };

  return (
    <button
      type="button"
      className={cn(
        "flex h-20 items-center justify-center border",
        clickable ? "cursor-pointer hover:bg-gray-100" : "cursor-default",
        isCurrentDay ? "bg-blue-500 text-white" : "bg-white text-black",
      )}
      onClick={handleClick}
      disabled={!clickable}
      tabIndex={clickable ? 0 : -1}
      aria-disabled={!clickable}
    >
      {day}
    </button>
  );
}
