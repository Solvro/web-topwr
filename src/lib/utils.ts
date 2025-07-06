import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { SelectInputOption } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const enumToFormSelectOptions = (
  enumObject: Record<string, string | number>,
  labels: Record<string | number, string>,
): SelectInputOption[] => {
  return Object.entries(enumObject)
    .filter(([key]) => Number.isNaN(Number(key)))
    .map(([, value]) => ({
      value,
      label: labels[value] ?? String(value),
    }));
};
