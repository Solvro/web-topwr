import { Clock } from "lucide-react";
import type { ChangeEvent } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { isEmptyValue } from "@/utils";
import { createUTCDateTime } from "@/utils/create-utc-datetime";
import { extractTime } from "@/utils/extract-time";

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
    if (!timeValue) {
      onChange(null);
      return;
    }
    const newDateTime = createUTCDateTime(value, timeValue);
    onChange(newDateTime);
  };

  const displayTime = isEmptyValue(value)
    ? "00:00:00"
    : extractTime(value.toString());

  return (
    <InputSlot renderAs={InputGroup} className="w-fit min-w-34 overflow-hidden">
      <InputGroupAddon>
        <Clock className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupInput
        type="time"
        step="1"
        value={displayTime}
        onChange={handleTimeChange}
        disabled={disabled}
      />
    </InputSlot>
  );
}
