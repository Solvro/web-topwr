import { format } from "date-fns";

export function serializeDateDay(date: Date | string): string {
  return format(new Date(date), "yyyy-MM-dd");
}
