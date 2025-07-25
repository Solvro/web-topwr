import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/config/constants";
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

export const requiredString = () =>
  z
    .string({ required_error: FORM_ERROR_MESSAGES.REQUIRED })
    .trim()
    .min(1, { message: FORM_ERROR_MESSAGES.NONEMPTY });

export function typedEntries<T extends Record<string, unknown>>(
  targetObject: T,
): [keyof T, T[keyof T]][] {
  return Object.entries(targetObject) as [keyof T, T[keyof T]][];
}

export function isKeyOf<T extends object, K extends string | number | symbol>(
  key: K,
  parentObject: T,
): key is K & keyof T {
  return key in parentObject;
}

/** This needs to be used instead of encodeURIComponent for requests made to the backend because it cannot parse '%20' as space, only the plus symbol. */
export const encodeQueryComponent = (value: string) =>
  encodeURIComponent(value).replaceAll("%20", "+");
