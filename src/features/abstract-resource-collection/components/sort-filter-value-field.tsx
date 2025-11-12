"use client";

import { useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";

import { PendingInput } from "@/components/inputs/pending-input";
import { SelectOptions } from "@/components/inputs/select-options";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isEmptyValue, tryParseNumber } from "@/lib/helpers";

import { FilterType } from "../enums";
import type {
  FilterDefinitions,
  SortFiltersFormValues,
} from "../types/internal";

// TODO: remove this rule from @solvro/config
/* eslint-disable @typescript-eslint/restrict-template-expressions */

export function FilterValueField({
  control,
  index,
  filterDefinitions,
}: {
  control: Control<SortFiltersFormValues>;
  index: number;
  filterDefinitions: FilterDefinitions;
}) {
  const fieldName = useWatch({
    name: `filters.${index}.field`,
    control,
  });

  const filterDefinition = filterDefinitions[fieldName];
  const label = `Wartość pola #${index + 1}`;

  return (
    <FormField
      control={control}
      name={`filters.${index}.value`}
      render={({ field }) =>
        isEmptyValue(fieldName) ? (
          <PendingInput
            label={label}
            message="Wybierz najpierw pole"
            className="size-full"
          />
        ) : (
          <FormItem className="flex-1">
            <FormLabel>{label}</FormLabel>
            {filterDefinition.type === FilterType.Select ? (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(tryParseNumber(value));
                }}
              >
                <FormControl>
                  <SelectTrigger className="mb-0 w-full">
                    <SelectValue placeholder="Wybierz wartość" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectOptions input={filterDefinition} />
                </SelectContent>
              </Select>
            ) : filterDefinition.type === FilterType.Checkbox ? (
              <div className="flex h-full items-center gap-2">
                <FormControl>
                  <Checkbox
                    className="mb-0"
                    checked={field.value === "true"}
                    onCheckedChange={(checked) => {
                      field.onChange(String(checked === true));
                    }}
                  />
                </FormControl>
                <FormLabel>{filterDefinition.label}</FormLabel>
              </div>
            ) : (
              <FormControl>
                <Input
                  value={field.value}
                  onChange={(event_) => {
                    field.onChange(event_.target.value);
                  }}
                  placeholder="Wpisz szukaną wartość"
                />
              </FormControl>
            )}
            <FormMessage />
          </FormItem>
        )
      }
    />
  );
}
