"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_URL } from "@/config/constants";
import { useAuth } from "@/hooks/use-auth";
import type { DaySwap, Weekday } from "@/types/dayswap";

interface Props {
  selectedDate: Date;
}
interface ApiResponse<T> {
  data: T;
}
interface ErrorResponse {
  message?: string;
}
export function DaySwapForm({ selectedDate }: Props) {
  const { accessToken } = useAuth();

  const [weekday, setWeekday] = useState<Weekday>("Monday");
  const [isEven, setIsEven] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [existingId, setExistingId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchDaySwap() {
      try {
        const response = await fetch(`${API_URL}/day_swaps`, {
          headers: {
            Authorization: `Bearer ${accessToken ?? ""}`,
          },
        });
        if (response.ok) {
          const payload = (await response.json()) as ApiResponse<DaySwap[]>;
          const items: DaySwap[] = payload.data;
          const targetDate = selectedDate.toISOString().split("T")[0] ?? "";
          const existing = items.find((item) => item.date === targetDate);

          if (existing === undefined) {
            setWeekday("Monday");
            setIsEven(true);
            setExistingId(null);
          } else {
            setWeekday(existing.changedWeekday);
            setIsEven(existing.changedDayIsEven);
            setExistingId(existing.id);
          }
        }
      } catch (error) {
        console.error("Błąd pobierania day_swap:", error);
      }
    }
    void fetchDaySwap();
  }, [selectedDate, accessToken]);

  async function handleSubmit() {
    setLoading(true);

    const dateString = selectedDate.toISOString().split("T")[0];
    if (!dateString) {
      console.error("Invalid date");
      setLoading(false);
      return;
    }
    const formData = {
      academicCalendarId: 1,
      date: selectedDate.toISOString().split("T")[0],
      changedWeekday: weekday,
      changedDayIsEven: isEven,
    };
    const hasExistingId =
      existingId !== null && existingId !== 0 && !Number.isNaN(existingId);
    const url = hasExistingId
      ? `${API_URL}/day_swaps/${existingId.toString()}`
      : `${API_URL}/day_swaps`;
    const method = hasExistingId ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken ?? ""}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = (await response.json()) as DaySwap;
        if (existingId === null) {
          setExistingId(responseData.id);
        }
      } else {
        const errorData = (await response.json()) as ErrorResponse;
        console.error("Błąd zapisywania day_swap:", errorData);
      }
    } catch (error) {
      console.error("Błąd requestu:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 space-y-4 border-t pt-4">
      <h3 className="text-sm font-semibold">Zmień dzień</h3>

      <div>
        <label htmlFor="weekday-select" className="mb-1 block text-xs">
          Nowy dzień tygodnia
        </label>
        <Select
          value={weekday}
          onValueChange={(value) => {
            setWeekday(value as Weekday);
          }}
        >
          <SelectTrigger id="weekday-select">
            <SelectValue placeholder="Wybierz dzień" />
          </SelectTrigger>
          <SelectContent>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="day-type-select" className="mb-1 block text-xs">
          Typ dnia
        </label>
        <Select
          value={isEven ? "even" : "odd"}
          onValueChange={(value) => {
            setIsEven(value === "even");
          }}
        >
          <SelectTrigger id="day-type-select">
            <SelectValue placeholder="Wybierz typ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="even">Parzysty</SelectItem>
            <SelectItem value="odd">Nieparzysty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full"
      >
        {loading
          ? "Zapisywanie..."
          : existingId !== null && existingId !== 0 && !Number.isNaN(existingId)
            ? "Zaktualizuj zmianę"
            : "Zapisz zmianę"}
      </Button>
    </div>
  );
}
