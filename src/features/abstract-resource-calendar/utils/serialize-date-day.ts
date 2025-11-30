import { format } from "date-fns";

import { parseLocalDate } from "@/utils/parse-local-date";

export function serializeDateDay(date: string): string {
  return format(parseLocalDate(date), "yyyy-MM-dd");
}
