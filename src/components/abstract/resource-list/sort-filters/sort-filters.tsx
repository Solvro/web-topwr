"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ClassValue } from "clsx";
import { BrushCleaning, Check, Plus, Trash } from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";

import { Counter } from "@/components/counter";
import { PendingInput } from "@/components/inputs/pending-input";
import { SelectOptions } from "@/components/inputs/select-options";
import { SelectClear } from "@/components/select-clear";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IMPLICIT_SORTABLE_FIELDS,
  SORT_DIRECTION_NAMES,
  SORT_FILTER_DEFAULT_VALUES,
  SORT_FILTER_LABEL_DECLENSION_CASES,
  SORT_FILTER_PLACEHOLDER,
} from "@/config/constants";
import { FilterType } from "@/config/enums";
import { useRouter } from "@/hooks/use-router";
import {
  getSearchParametersFromSortFilters,
  isEmptyValue,
  tryParseNumber,
  typedEntries,
} from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import { cn } from "@/lib/utils";
import { SortFiltersSchema } from "@/schemas";
import type { FilterDefinitions, LayoutProps } from "@/types/components";
import type {
  SortFiltersFormValues,
  SortFiltersFormValuesNarrowed,
} from "@/types/forms";
import type { DeclinableNoun } from "@/types/polish";

// TODO: remove this rule from @solvro/config
/* eslint-disable @typescript-eslint/restrict-template-expressions */

function FieldGroup({
  children,
  className,
}: LayoutProps & {
  className?: ClassValue;
}) {
  return (
    <div
      className={cn(
        "col-span-full grid grid-cols-subgrid gap-[inherit]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function FilterValueField({
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

export function SortFilters({
  sortableFields = [],
  filterDefinitions = {},
  onChangeFilters,
  defaultValues,
}: {
  sortableFields?: readonly DeclinableNoun[];
  filterDefinitions?: FilterDefinitions;
  onChangeFilters?: () => void;
  defaultValues?: Partial<SortFiltersFormValuesNarrowed>;
}) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(SortFiltersSchema),
    defaultValues: { ...SORT_FILTER_DEFAULT_VALUES, ...defaultValues },
  });
  const filters = useFieldArray({ control: form.control, name: "filters" });

  const sortLabels: [string, string][] = [
    ...IMPLICIT_SORTABLE_FIELDS,
    ...sortableFields,
  ].map((field) => [
    field,
    declineNoun(field, { case: SORT_FILTER_LABEL_DECLENSION_CASES.sortBy }),
  ]);

  function handleSubmit(values: SortFiltersFormValues) {
    const newParameters = getSearchParametersFromSortFilters(values);
    onChangeFilters?.();
    router.push(`?${newParameters.toString()}`);
    form.reset(values);
  }

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-[2fr_3fr]"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FieldGroup>
          <FormField
            control={form.control}
            name="sortBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sortuj według</FormLabel>
                <Select
                  value={field.value ?? ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder={SORT_FILTER_PLACEHOLDER} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectClear value={field.value} />
                    {sortLabels.map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sortDirection"
            render={({ field }) => (
              <FormItem>
                <FormLabel>w kolejności</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(SORT_DIRECTION_NAMES).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldGroup>
        {filters.fields.length === 0 ? null : (
          <FieldGroup className="mb-2 max-h-28 overflow-y-auto sm:max-h-56">
            {filters.fields.map((filter, index) => (
              <FieldGroup key={filter.id}>
                <FormField
                  control={form.control}
                  name={`filters.${index}.field`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue(
                            `filters.${index}.value`,
                            filterDefinitions[value].type ===
                              FilterType.Checkbox
                              ? "false"
                              : "",
                          );
                        }}
                      >
                        <FormLabel>Pole #{index + 1}</FormLabel>
                        <FormControl className="mb-0 w-full">
                          <SelectTrigger>
                            <SelectValue
                              placeholder={SORT_FILTER_PLACEHOLDER}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectClear value={field.value} />
                          {typedEntries(filterDefinitions).map(
                            ([filterField, { label }]) => (
                              <SelectItem key={filterField} value={filterField}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <FilterValueField
                    control={form.control}
                    index={index}
                    filterDefinitions={filterDefinitions}
                  />
                  <Button
                    type="button"
                    size="icon"
                    aria-label={`Usuń filtr pola #${index + 1}`}
                    className="ml-auto self-end"
                    variant="destructive"
                    onClick={() => {
                      filters.remove(index);
                    }}
                  >
                    <Trash />
                  </Button>
                </div>
              </FieldGroup>
            ))}
          </FieldGroup>
        )}
        <Button
          type="button"
          className="relative col-span-full"
          size="sm"
          variant="secondary"
          onClick={() => {
            filters.append({ field: "", value: "" });
          }}
        >
          Dodaj filtr
          <Plus />
          <Counter values={filters.fields} label="Liczba filtrowanych pól" />
        </Button>
        <FieldGroup className="grid-cols-2">
          <Button
            type="reset"
            variant="ghost"
            onClick={() => {
              handleSubmit(SORT_FILTER_DEFAULT_VALUES);
            }}
          >
            Wyczyść filtry <BrushCleaning />
          </Button>
          <Button type="submit" disabled={!form.formState.isDirty}>
            Zatwierdź <Check />
          </Button>
        </FieldGroup>
      </form>
    </Form>
  );
}
