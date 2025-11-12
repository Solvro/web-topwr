"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BrushCleaning, Check, Plus, Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import { Counter } from "@/components/core/counter";
import { SelectClear } from "@/components/inputs/select-clear";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { declineNoun } from "@/features/polish";
import type { DeclinableNoun } from "@/features/polish/types";
import { useRouter } from "@/hooks/use-router";
import { typedEntries } from "@/lib/helpers";

import { IMPLICIT_SORTABLE_FIELDS } from "../data/implicit-sortable-fields";
import { SORT_DIRECTION_NAMES } from "../data/sort-direction-names";
import { SORT_FILTER_DEFAULT_VALUES } from "../data/sort-filter-default-values";
import { SORT_FILTER_LABEL_DECLENSION_CASES } from "../data/sort-filter-label-declension-cases";
import { SORT_FILTER_PLACEHOLDER } from "../data/sort-filter-placeholder";
import { FilterType } from "../enums";
import { SortFiltersSchema } from "../schemas/sort-filters-schema";
import type {
  FilterDefinitions,
  SortFiltersFormValues,
  SortFiltersFormValuesNarrowed,
} from "../types/internal";
import { serializeSortFilters } from "../utils/serialize-sort-filters";
import { FieldGroup } from "./field-group";
import { FilterValueField } from "./sort-filter-value-field";

// TODO: remove this rule from @solvro/config
/* eslint-disable @typescript-eslint/restrict-template-expressions */

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
    const newParameters = serializeSortFilters(values);
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
