import type { User } from "@/types/api";
import type { SelectInputOption } from "@/types/forms";

/** Prefers the user's full name, falling back to their email. */
export const getUserDisplayName = (user: User): string =>
  user.fullName ?? user.email;

export const enumToFormSelectOptions = <T extends string | number>(
  enumObject: Record<string, T>,
  labels: Record<T, string>,
): SelectInputOption[] =>
  Object.entries(enumObject)
    .filter(([key]) => Number.isNaN(Number(key)))
    .map(([, value]) => ({
      value,
      label: labels[value],
    }));

export function sanitizeId(id: string): string {
  return String(id).trim().replaceAll(/[^\d]/g, "");
}
