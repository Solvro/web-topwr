import type { DateObject } from "../types/internal";

export function formatDateObject(displayedDateObject: DateObject): string {
  const { year, month, day } = displayedDateObject;
  return `${year.toString()}-${month.value.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}
