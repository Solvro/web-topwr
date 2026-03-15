import { format } from "date-fns";

export const formatDateKey = (date: Date) => format(date, "yyyy-MM-dd");
