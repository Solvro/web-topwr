"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import type { ControllerRenderProps } from "react-hook-form";
import type { z } from "zod";

import { fetchMutation } from "@/lib/fetch-utils";
import { AddEventSchema } from "@/schemas";
import type { CalendarEvent } from "@/types/calendar";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
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

interface Props {
  existingEvent?: CalendarEvent;
  selectedDate?: Date;
  onSuccess?: () => void;
}

export function AddEventForm({
  existingEvent,
  selectedDate,
  onSuccess,
}: Props) {
  const getDefaultStartTime = () => {
    if (existingEvent !== undefined) {
      return existingEvent.startTime;
    }
    if (selectedDate !== undefined) {
      const defaultTime = new Date(selectedDate);
      defaultTime.setHours(10, 0, 0, 0); // Default to 10:00 AM
      return defaultTime;
    }
    return new Date(Date.now() + 60 * 10 * 1000); // Ten minutes from now
  };

  const getDefaultEndTime = () => {
    if (existingEvent !== undefined) {
      return existingEvent.endTime;
    }
    const startTime = getDefaultStartTime();
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1); // One hour after start time
    return endTime;
  };

  const isEditing = Boolean(existingEvent);

  const form = useForm<AddEventFormData>({
    resolver: zodResolver(AddEventSchema),
    defaultValues: {
      name: existingEvent?.name ?? "",
      description: existingEvent?.description ?? "",
      location: existingEvent?.location ?? "",
      startTime: getDefaultStartTime(),
      endTime: getDefaultEndTime(),
      googleCallId: existingEvent?.googleCallId ?? null,
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
      let endpoint = "/event_calendar";
      let method: "POST" | "PATCH" = "POST";

      if (isEditing && existingEvent?.id !== undefined) {
        endpoint = `/event_calendar/${existingEvent.id}`;
        method = "PATCH";
      }

      const response = await fetchMutation(endpoint, formData, {
        method,
      });
      console.warn("Response from server:", response);

      // Call onSuccess callback if provided
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  async function handleDelete() {
    if (!isEditing || existingEvent?.id === undefined) {
      return;
    }

    try {
      const response = await fetchMutation(
        `/event_calendar/${existingEvent.id}`,
        null,
        {
          method: "DELETE",
        },
      );
      console.warn("Event deleted:", response);

      // Call onSuccess callback if provided
      onSuccess?.();
    } catch (error) {
      console.error("Error deleting event:", error);
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
          {form.formState.isSubmitting
            ? isEditing
              ? "Aktualizowanie..."
              : "Dodawanie..."
            : isEditing
              ? "Aktualizuj wydarzenie"
              : "Dodaj wydarzenie"}
        </Button>

        {isEditing ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Usuń wydarzenie
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Czy na pewno chcesz usunąć to wydarzenie?
                </DialogTitle>
                <DialogDescription>
                  Tego kroku nie można cofnąć. Wydarzenie zostanie trwale
                  usunięte.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 flex w-full gap-2">
                <Button
                  variant="destructive"
                  className="h-12 w-1/2"
                  onClick={handleDelete}
                  disabled={form.formState.isSubmitting}
                >
                  Usuń
                </Button>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="h-12 w-1/2">
                    Anuluj
                  </Button>
                </DialogTrigger>
              </div>
            </DialogContent>
          </Dialog>
        ) : null}
      </form>
    </Form>
  );
}
