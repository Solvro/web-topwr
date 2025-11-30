"use client";

import { toDate } from "date-fns";

import { isEmptyValue } from "@/utils";
import { parseLocalDate } from "@/utils/parse-local-date";

import { DatePicker } from "./date-picker";
import { InputRow } from "./input-row";
import { TimePicker } from "./time-picker";

export function DateTimePicker({
  value,
  onChange,
  disabled = false,
}: {
  value: string | null;
  onChange: (date: string | null) => void;
  disabled?: boolean;
}) {
  const date = isEmptyValue(value) ? null : toDate(value);

  const handleDateChange = (dateValue: string | null) => {
    if (dateValue === null) {
      onChange(null);
      return;
    }

    const selectedDate = parseLocalDate(dateValue);

    date == null
      ? selectedDate.setHours(12, 0, 0, 0)
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
      <DatePicker
        value={value}
        disabled={disabled}
        onChange={handleDateChange}
      />
      <TimePicker value={value} disabled={disabled} onChange={onChange} />
    </InputRow>
  );
}
