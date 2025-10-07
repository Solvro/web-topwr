"use client";

import { format } from "date-fns";
import { Clock } from "lucide-react";
import type { ChangeEvent } from "react";

import { Input } from "@/components/ui/input";

import { DatePicker } from "./date-picker";

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
    const [hours, minutes, seconds = "00"] = timeValue.split(":");

    let baseDate: Date;
    if (date === undefined) {
      baseDate = new Date();
      baseDate.setHours(0, 0, 0, 0);
    } else {
      baseDate = new Date(date);
    }

    baseDate.setHours(
      Number.parseInt(hours, 10),
      Number.parseInt(minutes, 10),
      Number.parseInt(seconds, 10),
      0,
    );
    onChange(baseDate.toISOString());
  };

  return (
    <div className="flex gap-2">
      <DatePicker value={value} onChange={handleDateChange} />
      <div className="flex items-end">
        <div className="relative">
          <Clock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="time"
            step="1"
            value={date === undefined ? "00:00:00" : format(date, "HH:mm:ss")}
            className="bg-background w-32 appearance-none pl-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            onChange={handleTimeChange}
          />
        </div>
      </div>
    </div>
  );
}
