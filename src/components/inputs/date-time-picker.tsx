"use client";

import { format, isValid, parseISO, set } from "date-fns";

import { TooltipWrapper } from "@/components/core/tooltip-wrapper";
import { isEmptyValue } from "@/utils";

import { DatePicker } from "./date-picker";
import { InputRow } from "./input-row";
import { TimePicker } from "./time-picker";
import { parseStringDate } from "./utils/parse-string-date";

export function DateTimePicker({
  value,
  onChange,
  disabled = false,
}: {
  value: string | null;
  onChange: (date: string | null) => void;
  disabled?: boolean;
}) {
  const date =
    !isEmptyValue(value) && isValid(parseISO(value)) ? parseISO(value) : null;

  const handleDateChange = (dateValue: string | null) => {
    if (dateValue == null) {
      onChange(null);
      return;
    }

    const parsedDate = parseStringDate(dateValue);
    if (parsedDate == null) {
      onChange(null);
      return;
    }

    const newValue = set(date ?? new Date().setHours(0, 0, 0, 0), {
      year: parsedDate.getFullYear(),
      month: parsedDate.getMonth(),
      date: parsedDate.getDate(),
    });
    onChange(newValue.toISOString());
  };

  return (
    <InputRow>
      <DatePicker
        value={date == null ? null : format(date, "yyyy-MM-dd")}
        disabled={disabled}
        onChange={handleDateChange}
      />
      <TooltipWrapper
        tooltip={
          date == null
            ? "Najpierw wybierz datę, aby ustawić godzinę"
            : undefined
        }
      >
        <div>
          <TimePicker
            value={value}
            disabled={disabled || date == null}
            onChange={onChange}
          />
        </div>
      </TooltipWrapper>
    </InputRow>
  );
}
