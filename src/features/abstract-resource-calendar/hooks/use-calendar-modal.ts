import { useContext } from "react";

import { CalendarModalContext } from "../context/calendar-modal-context";

export const useCalendarModal = () => {
  const context = useContext(CalendarModalContext);

  if (context == null) {
    throw new Error(
      "useCalendarModal must be used within a CalendarModalProvider",
    );
  }

  return context;
};
