"use client";

import { format } from "date-fns";
import { pl } from "date-fns/locale/pl";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

import { InputSlot } from "@/components/inputs/input-slot";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { isEmptyValue } from "@/utils";

export function DatePicker({
  value,
  onChange,
  disabled = false,
}: {
  value: string | null;
  onChange: (date: string | null) => void;
  disabled?: boolean;
}) {
  const date = isEmptyValue(value) ? null : new Date(value);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <FormControl>
        <PopoverTrigger asChild data-empty={date == null}>
          <InputSlot
            renderAs={Button}
            variant="outline"
            className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
            disabled={disabled}
          >
            <CalendarIcon />
            {date == null ? (
              <span>Wybierz datę</span>
            ) : (
              format(date, "PPP", { locale: pl })
            )}
          </InputSlot>
        </PopoverTrigger>
      </FormControl>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date ?? undefined}
          captionLayout="dropdown"
          onSelect={(newValue) => {
            onChange(newValue?.toISOString() ?? null);
            setIsOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
