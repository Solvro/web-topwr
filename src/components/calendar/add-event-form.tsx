"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ControllerRenderProps } from "react-hook-form";
import type { z } from "zod";

import { fetchMutation } from "@/lib/fetch-utils";
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
      startTime: new Date(Date.now() + 60 * 10 * 1000), // Ten minutes from now
      endTime: new Date(Date.now() + 60 * 60 * 1000), // One hour after startTime
      googleCallId: null, // Optional field, can be null
    },
  });

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<AddEventFormData>,
  ) {
    const timeValue = event.target.value;
    const [hours, minutes, seconds = "00"] = timeValue.split(":");
    const existingDate = new Date(field.value ?? new Date());
    existingDate.setHours(
      Number.parseInt(hours, 10),
      Number.parseInt(minutes, 10),
      Number.parseInt(seconds, 10),
    );
    field.onChange(existingDate);
  }

  async function onSubmit(data: AddEventFormData) {
    const formData = {
      name: data.name,
      googleCallId: data.googleCallId ?? null,
      description: data.description ?? "",
      startTime: data.startTime.toISOString(),
      endTime: data.endTime.toISOString(),
      location: data.location ?? "",
    };

    console.warn("Form data:", formData);

    try {
      const response = await fetchMutation("/event_calendar", formData, {
        method: "POST",
      });
      console.warn("Response from server:", response);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

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
                  defaultValue={`${field.value.getHours().toString().padStart(2, "0")}:${(field.value.getMinutes() + 10).toString().padStart(2, "0")}:${field.value.getSeconds().toString().padStart(2, "0")}`}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  onChange={(event) => {
                    handleChange(event, field);
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
                  defaultValue={`${(field.value.getHours() + 0).toString().padStart(2, "0")}:${field.value.getMinutes().toString().padStart(2, "0")}:${field.value.getSeconds().toString().padStart(2, "0")}`}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  onChange={(event) => {
                    handleChange(event, field);
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
                <Textarea
                  placeholder="Wprowadź opis wydarzenia"
                  {...field}
                  value={field.value ?? ""}
                />
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
                  value={field.value ?? ""}
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
