import type { User } from "@/types/api";

import type { SelectInputOption } from "./types";

/** Prefers the user's full name, falling back to their email. */
export const getUserDisplayName = (user: User): string =>
  user.fullName ?? user.email;

export function enumToFormSelectOptions<
  T extends Record<string, string | number>,
>(
  enumObject: T,
  labels: Partial<Record<T[keyof T], string>>,
): SelectInputOption[] {
  return Object.entries(enumObject)
    .filter(([key]) => Number.isNaN(Number(key)))
    .map(([, value]) => ({
      value,
      label: labels[value as T[keyof T]] ?? String(value),
    }));
}

export function sanitizeId(id: string): string {
  return String(id).split(/ /)[0].replaceAll(/[^\d]/g, "");
}
