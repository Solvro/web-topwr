import { formatDate, isValid, parse, toDate } from "date-fns";
import { Clock } from "lucide-react";
import type { ChangeEvent } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { isEmptyValue } from "@/utils";

import { InputSlot } from "./input-slot";

export function TimePicker({
  value,
  onChange,
  disabled = false,
}: {
  value: Date | string | null;
  onChange: (date: string | null) => void;
  disabled?: boolean;
}) {
  const handleTimeChange = (event_: ChangeEvent<HTMLInputElement>) => {
    const timeValue = event_.target.value;
    const baseDate = value == null ? new Date() : toDate(value);
    const parsedTime = parse(timeValue, "HH:mm:ss", baseDate);
    if (isValid(parsedTime)) {
      onChange(parsedTime.toISOString());
    } else {
      event_.preventDefault();
    }
  };

  return (
    <InputSlot renderAs={InputGroup} className="w-fit min-w-34 overflow-hidden">
      <InputGroupAddon>
        <Clock className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupInput
        type="time"
        step="1"
        value={isEmptyValue(value) ? "00:00:00" : formatDate(value, "HH:mm:ss")}
        onChange={handleTimeChange}
        disabled={disabled}
      />
    </InputSlot>
  );
}
