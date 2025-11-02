import { atom } from "jotai";

import { getCurrentDate } from "@/lib/helpers";

interface CalendarState {
  displayedYear: number;
  displayedMonth: number;
}

const currentDate = getCurrentDate();

export const calendarStateAtom = atom<CalendarState>({
  displayedYear: currentDate.year,
  displayedMonth: currentDate.month.value,
});
