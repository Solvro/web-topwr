import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { SelectInputOption } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const enumToFormSelectOptions = (
  enumObject: Record<string, string>,
  labels: Record<string, string>,
): SelectInputOption[] => {
  return Object.entries(enumObject).map(([, value]) => ({
    value,
    label: labels[value] ?? value,
  }));
};

export const arrayToFormSelectOptions = (
  array: { id: number; name: string }[],
): SelectInputOption[] => {
  return array.map((item) => ({
    value: item.id,
    label: item.name,
  }));
};
