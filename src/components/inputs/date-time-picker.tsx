"use client";

import { toDate } from "date-fns";

import { isEmptyValue } from "@/utils";

import { DatePicker } from "./date-picker";
import { InputRow } from "./input-row";
import { TimePicker } from "./time-picker";

export function DateTimePicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (date: string | null) => void;
}) {
  const date = isEmptyValue(value) ? null : toDate(value);

  const handleDateChange = (dateValue: string | null) => {
    if (dateValue === null) {
      onChange(null);
      return;
    }

    const selectedDate = new Date(dateValue);

    date == null
      ? selectedDate.setHours(0, 0, 0, 0)
      : selectedDate.setHours(
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
          0,
        );

    onChange(selectedDate.toISOString());
  };

  return (
    <InputRow>
      <DatePicker value={value} onChange={handleDateChange} />
      <TimePicker value={value} onChange={onChange} />
    </InputRow>
  );
}
