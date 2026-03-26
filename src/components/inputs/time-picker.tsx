import { formatDate, isValid, parse, parseISO } from "date-fns";
import { Clock } from "lucide-react";
import type { ChangeEvent } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { isEmptyValue } from "@/utils";

import { InputSlot } from "./input-slot";

function isISODatetime(value: string): boolean {
  return value.includes("T");
}

function toBaseDate(value: Date | string | null): Date | null {
  if (value instanceof Date) {
    return isValid(value) ? value : null;
  }
  if (typeof value === "string" && isISODatetime(value)) {
    const parsedValue = parseISO(value);
    return isValid(parsedValue) ? parsedValue : null;
  }
  return null;
}

export function TimePicker({
  value,
  onChange,
  disabled = false,
}: {
  value: Date | string | null;
  onChange: (date: string | null) => void;
  disabled?: boolean;
}) {
  const base = toBaseDate(value);
  const inputValue =
    base == null
      ? isEmptyValue(value)
        ? "00:00:00"
        : String(value)
      : formatDate(base, "HH:mm:ss");

  const handleTimeChange = (event_: ChangeEvent<HTMLInputElement>) => {
    const timeValue = event_.target.value;
    if (!timeValue) {
      onChange(null);
      return;
    }

    const baseDate = toBaseDate(value);
    if (baseDate != null) {
      const parsedTime = parse(timeValue, "HH:mm:ss", baseDate);
      onChange(parsedTime.toISOString());
      return;
    }

    onChange(timeValue);
  };

  return (
    <InputSlot renderAs={InputGroup} className="w-fit min-w-34 overflow-hidden">
      <InputGroupAddon>
        <Clock className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupInput
        type="time"
        step="1"
        value={inputValue}
        onChange={handleTimeChange}
        disabled={disabled}
      />
    </InputSlot>
  );
}
