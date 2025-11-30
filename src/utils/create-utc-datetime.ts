import { format } from "date-fns";

import { parseLocalDate } from "./parse-local-date";

export function createUTCDateTime(
  baseDate: Date | string | null,
  timeString: string,
): string {
  const base =
    baseDate == null ? new Date() : parseLocalDate(baseDate.toString());
  const [hours, minutes, seconds = "00"] = timeString.split(":").map(Number);

  base.setHours(hours, minutes, Number(seconds), 0);

  return format(base, "yyyy-MM-dd'T'HH:mm:ss.000'Z'");
}
