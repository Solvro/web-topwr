"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ClassValue } from "clsx";
import { BrushCleaning, Check, Plus, Trash } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";

import { PendingInput } from "@/components/inputs/pending-input";
import { SelectOptions } from "@/components/inputs/select-options";
import { SelectClear } from "@/components/select-clear";
import { Button } from "@/components/ui/button";
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
  IMPLICIT_SORT_BY_ATTRIBUTES,
  SORT_DIRECTION_NAMES,
  SORT_FILTER_DEFAULT_VALUES,
  SORT_FILTER_LABEL_DECLENSION_CASES,
  SORT_FILTER_PLACEHOLDER,
} from "@/config/constants";
import { FilterType } from "@/config/enums";
import {
  isEmptyValue,
  quoteText,
  tryParseNumber,
  typedEntries,
} from "@/lib/helpers";
import { getSearchParametersFromSortFilters } from "@/lib/helpers/app";
import { declineNoun } from "@/lib/polish";
import { cn } from "@/lib/utils";
import { SortFiltersSchema } from "@/schemas";
import type { FilterOptions, LayoutProps } from "@/types/components";
import type { SortFiltersFormValues } from "@/types/forms";
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
  filterableFields,
}: {
  control: Control<SortFiltersFormValues>;
  index: number;
  filterableFields: FilterOptions;
}) {
  const fieldName = useWatch({
    name: `filters.${index}.field`,
    control,
  });

  const filterOptions = filterableFields[fieldName];
  const labelBase = "Zawartość pola";

  return (
    <FormField
      control={control}
      name={`filters.${index}.value`}
      render={({ field }) =>
        isEmptyValue(fieldName) ? (
          <PendingInput
            label={labelBase}
            message="Wybierz najpierw pole"
            className="size-full"
          />
        ) : (
          <FormItem className="flex-1">
            <FormLabel>
              {labelBase} {quoteText(fieldName)}
            </FormLabel>
            {filterOptions.type === FilterType.Select ? (
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
                  <SelectOptions input={filterOptions} />
                </SelectContent>
              </Select>
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
  filterableFields = {},
  onChangeFilters,
  defaultValues,
}: {
  sortableFields?: readonly DeclinableNoun[];
  filterableFields?: FilterOptions;
  onChangeFilters?: () => void;
  defaultValues?: Partial<SortFiltersFormValues>;
}) {
  const router = useRouter();
  const form = useForm<SortFiltersFormValues>({
    resolver: zodResolver(SortFiltersSchema),
    defaultValues: { ...SORT_FILTER_DEFAULT_VALUES, ...defaultValues },
  });
  const filters = useFieldArray({ control: form.control, name: "filters" });

  const sortLabels: [string, string][] = [
    ...IMPLICIT_SORT_BY_ATTRIBUTES,
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
        className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-[2fr_3fr]"
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
                  value={field.value ?? undefined}
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
                    <SelectClear resetValue={null} {...field} />
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
                    }}
                  >
                    <FormLabel>Pole #{index + 1}</FormLabel>
                    <FormControl className="mb-0 w-full">
                      <SelectTrigger>
                        <SelectValue placeholder={SORT_FILTER_PLACEHOLDER} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectClear {...field} />
                      {typedEntries(filterableFields).map(
                        ([filterField, filterOptions]) => (
                          <SelectItem key={filterField} value={filterField}>
                            {filterOptions.label}
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
                filterableFields={filterableFields}
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
        <Button
          type="button"
          className="col-span-full mt-2"
          size="sm"
          variant="secondary"
          onClick={() => {
            filters.append({ field: "", value: "" });
          }}
        >
          Dodaj filtr <Plus />
        </Button>
        <FieldGroup className="justify-between">
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
