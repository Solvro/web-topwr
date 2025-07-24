import type { FieldPath } from "react-hook-form";
import { ZodDefault, ZodOptional } from "zod";
import type { ZodObject, ZodRawShape, z } from "zod";

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

export function sanitizeId(id: string | number): string {
  return String(id).trim().replaceAll(/[^\d]/g, "");
}

export function removeTrailingSlash(path: string): string {
  return path.replace(/\/+$/, "");
}

export function isFieldRequired<T extends ZodRawShape>(
  schema: ZodObject<T>,
  fieldName: FieldPath<z.infer<ZodObject<T>>>,
): boolean {
  const shape = schema.shape;

  const fieldSchema = shape[fieldName];

  // If the field is optional or has a default, it's not required
  return !(
    fieldSchema instanceof ZodOptional || fieldSchema instanceof ZodDefault
  );
}
