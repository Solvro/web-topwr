"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { AddEventSchema } from "@/schemas";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type AddEventFormData = z.infer<typeof AddEventSchema>;

export function AddEventForm() {
  const form = useForm<AddEventFormData>({
    resolver: zodResolver(AddEventSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      startTime: new Date(),
      endTime: new Date(),
    },
  });

  const onSubmit = (data: AddEventFormData) => {
    try {
      // TODO: Add your API call here
      console.warn("Form data:", data);

      // Reset form on successful submission
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tytuł wydarzenia</FormLabel>
              <FormControl>
                <Input placeholder="Wprowadź tytuł wydarzenia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Godzina rozpoczęcia</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  step="1"
                  defaultValue="00:00:00"
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  onChange={(event) => {
                    const timeValue = event.target.value;
                    const [hours, minutes, seconds = "00"] =
                      timeValue.split(":");
                    const newDate = new Date();
                    newDate.setHours(
                      Number.parseInt(hours, 10),
                      Number.parseInt(minutes, 10),
                      Number.parseInt(seconds, 10),
                    );
                    field.onChange(newDate);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Godzina zakończenia</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  step="1"
                  defaultValue="00:00:00"
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  onChange={(event) => {
                    const timeValue = event.target.value;
                    const [hours, minutes, seconds = "00"] =
                      timeValue.split(":");
                    const newDate = new Date();
                    newDate.setHours(
                      Number.parseInt(hours, 10),
                      Number.parseInt(minutes, 10),
                      Number.parseInt(seconds, 10),
                    );
                    field.onChange(newDate);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opis wydarzenia</FormLabel>
              <FormControl>
                <Textarea placeholder="Wprowadź opis wydarzenia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lokalizacja</FormLabel>
              <FormControl>
                <Input
                  placeholder="Wprowadź lokalizację wydarzenia"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? "Dodawanie..." : "Dodaj wydarzenie"}
        </Button>
      </form>
    </Form>
  );
}
