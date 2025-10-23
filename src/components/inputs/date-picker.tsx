"use client";

import { format } from "date-fns";
import { pl } from "date-fns/locale/pl";
import { Calendar as CalendarIcon } from "lucide-react";

import { InputSlot } from "@/components/inputs/input-slot";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (date: string | null) => void;
}) {
  const date = value == null || value === "" ? undefined : new Date(value);
  return (
    <>
      <FormControl>
        <Input
          type="date"
          className="hidden"
          value={date == null ? "" : format(date, "yyyy-MM-dd")}
          readOnly
        />
      </FormControl>
      <Popover>
        <PopoverTrigger asChild>
          <InputSlot asChild>
            <Button
              variant="outline"
              data-empty={date == null}
              className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
            >
              <CalendarIcon />
              {date == null ? (
                <span>Wybierz datę</span>
              ) : (
                format(date, "PPP", { locale: pl })
              )}
            </Button>
          </InputSlot>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newValue) => {
              onChange(newValue?.toISOString() ?? null);
            }}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
