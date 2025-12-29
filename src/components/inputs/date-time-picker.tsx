"use client";

import { format, isValid, parse } from "date-fns";

import { isEmptyValue } from "@/utils";

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
  const date = isEmptyValue(value) ? null : new Date(value);

  const formatedDateValue = date == null ? null : format(date, "yyyy-MM-dd");

  const handleDateChange = (dateValue: string | null) => {
    if (dateValue === null) {
      onChange(null);
      return;
    }

    const selectedDate = parse(dateValue, "yyyy-MM-dd", new Date());
    if (!isValid(selectedDate)) {
      return;
    }

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
      <DatePicker
        value={formatedDateValue}
        disabled={disabled}
        onChange={handleDateChange}
      />
      <TimePicker value={value} disabled={disabled} onChange={onChange} />
    </InputRow>
  );
}
