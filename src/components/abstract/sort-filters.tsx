"use client";

import type { ClassValue } from "clsx";
import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import type { ListSearchParameters } from "./abstract-resource-list";

const directionOptions: Record<string, string> = {
  asc: "rosnącej",
  desc: "malejącej",
};

function FieldGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: ClassValue;
}) {
  return <div className={cn("flex gap-[inherit]", className)}>{children}</div>;
}

export function SortFilters({
  sortFields,
  searchFields,
  searchParams,
}: {
  sortFields: Record<string, string>;
  searchFields: Record<string, string>;
  searchParams: ListSearchParameters;
}) {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      sortBy: "id",
      sortDirection: "asc",
      searchTerm: "",
      searchField: Object.keys(searchFields)[0],
    },
  });

  const sortOptions: Record<string, string> = {
    id: "identyfikatora",
    ...sortFields,
    createdAt: "daty utworzenia",
    updatedAt: "daty ostatniej aktualizacji",
  };

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={form.handleSubmit((values) => {
        router.push(
          `?${new URLSearchParams({ ...searchParams, ...values }).toString()}`,
        );
      })}
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
                  <SelectTrigger>{sortOptions[field.value]}</SelectTrigger>
                  <SelectContent>
                    {Object.entries(sortOptions).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <SelectTrigger>{directionOptions[field.value]}</SelectTrigger>
                  <SelectContent>
                    {Object.entries(directionOptions).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <SelectTrigger>{searchFields[field.value]}</SelectTrigger>
                  <SelectContent>
                    {Object.entries(searchFields).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="searchTerm"
            render={({ field }) => (
              <FormItem className="pb-1.5">
                <FormLabel>wyrażenia</FormLabel>
                <Input
                  value={field.value}
                  onChange={(event_) => {
                    field.onChange(event_.target.value);
                  }}
                  placeholder="wpisz szukaną frazę"
                />
              </FormItem>
            )}
          />
        </FieldGroup>
        <FieldGroup className="ml-auto">
          <Button
            type="reset"
            variant="ghost"
            onClick={() => {
              form.reset();
            }}
          >
            Wyczyść filtry
          </Button>
          <Button
            asChild
            type="submit"
            className={cn({
              "bg-muted! text-muted-foreground! cursor-not-allowed":
                !form.formState.isDirty,
            })}
          >
            <Link
              href={{
                query: form.formState.isDirty ? form.getValues() : {},
              }}
            >
              Zatwierdź
              <Check />
            </Link>
          </Button>
        </FieldGroup>
      </Form>
    </form>
  );
}
