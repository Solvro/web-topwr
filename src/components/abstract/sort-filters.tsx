"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ClassValue } from "clsx";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";

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
  SORT_DIRECTIONS,
  SORT_FILTER_LABEL_DECLENSION_CASES,
  SORT_FILTER_PLACEHOLDER,
} from "@/config/constants";
import type { Resource } from "@/config/enums";
import { declineNoun } from "@/lib/polish";
import { cn } from "@/lib/utils";
import { SortFiltersSchema } from "@/schemas";
import type { ResourceDeclinableField } from "@/types/app";
import type { SortFiltersFormValues } from "@/types/forms";

import { SelectClear } from "../select-clear";

function FieldGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: ClassValue;
}) {
  return <div className={cn("flex gap-[inherit]", className)}>{children}</div>;
}

export function SortFilters<T extends Resource>({
  sortableFields = [],
  searchableFields = [],
}: {
  sortableFields?: readonly ResourceDeclinableField<T>[];
  searchableFields?: readonly ResourceDeclinableField<T>[];
}) {
  const router = useRouter();
  const searchParameters = useSearchParams();
  const defaultValues = SortFiltersSchema.parse({});
  const form = useForm({
    resolver: zodResolver(SortFiltersSchema),
    defaultValues: {
      ...defaultValues,
      ...Object.fromEntries(searchParameters.entries()),
    },
  });

  const sortLabels: [string, string][] = [
    ...IMPLICIT_SORT_BY_ATTRIBUTES,
    ...sortableFields,
  ].map((field) => [
    field,
    declineNoun(field, { case: SORT_FILTER_LABEL_DECLENSION_CASES.sortBy }),
  ]);

  const searchLabels: [string, string][] = searchableFields.map((field) => [
    field,
    declineNoun(field, {
      case: SORT_FILTER_LABEL_DECLENSION_CASES.searchField,
    }),
  ]);

  function handleSubmit(values: SortFiltersFormValues) {
    const newParameters = new URLSearchParams(searchParameters);
    for (const [key, value] of Object.entries(values)) {
      if (value === "") {
        newParameters.delete(key);
      } else {
        newParameters.set(key, value);
      }
    }
    router.push(`?${newParameters.toString()}`);
    form.reset(values);
  }

  return (
    <form
      className="flex flex-wrap items-start gap-2"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <Form {...form}>
        <FieldGroup>
          <FormField
            control={form.control}
            name="sortBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sortuj według</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={SORT_FILTER_PLACEHOLDER} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(SORT_DIRECTIONS).map(([value, label]) => (
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
        </FieldGroup>
        <FieldGroup className="md:ml-8">
          <FormField
            control={form.control}
            name="searchField"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Szukaj w</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={SORT_FILTER_PLACEHOLDER} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectClear field={field} />
                    {searchLabels.map(([value, label]) => (
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
            name="searchTerm"
            render={({ field }) => (
              <FormItem className="pb-1.5">
                <FormLabel>wyrażenia</FormLabel>
                <FormControl>
                  <Input
                    value={field.value}
                    onChange={(event_) => {
                      field.onChange(event_.target.value);
                    }}
                    placeholder="wpisz szukaną frazę"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldGroup>
        <FieldGroup className="ml-auto">
          <Button
            type="reset"
            variant="ghost"
            onClick={() => {
              form.reset(defaultValues);
              handleSubmit(defaultValues);
            }}
          >
            Wyczyść filtry
          </Button>
          <Button
            type="submit"
            className={cn({
              "bg-muted! text-muted-foreground! cursor-not-allowed":
                !form.formState.isDirty,
            })}
          >
            Zatwierdź
            <Check />
          </Button>
        </FieldGroup>
      </Form>
    </form>
  );
}
