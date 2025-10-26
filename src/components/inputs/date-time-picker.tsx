"use client";

import { format, isValid, parse } from "date-fns";
import { Clock } from "lucide-react";
import type { ChangeEvent } from "react";

import { InputSlot } from "@/components/inputs/input-slot";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { DatePicker } from "./date-picker";
import { InputRow } from "./input-row";

export function DateTimePicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (date: string | null) => void;
}) {
  const date = value == null || value === "" ? undefined : new Date(value);

  const handleDateChange = (dateValue: string | null) => {
    if (dateValue === null) {
      onChange(null);
      return;
    }

    const selectedDate = new Date(dateValue);

    date === undefined
      ? selectedDate.setHours(0, 0, 0, 0)
      : selectedDate.setHours(
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
          0,
        );

    onChange(selectedDate.toISOString());
  };

  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const timeValue = event.target.value;
    const baseDate = date ?? new Date();
    const parsedTime = parse(timeValue, "HH:mm:ss", baseDate);
    if (isValid(parsedTime)) {
      onChange(parsedTime.toISOString());
    }
  };

  return (
    <InputRow>
      <DatePicker value={value} onChange={handleDateChange} />
      <InputSlot
        renderAs={InputGroup}
        className="w-fit min-w-34 overflow-hidden"
      >
        <InputGroupAddon>
          <Clock className="text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupInput
          type="time"
          step="1"
          value={date === undefined ? "00:00:00" : format(date, "HH:mm:ss")}
          onChange={handleTimeChange}
        />
      </InputSlot>
    </InputRow>
  );
}
