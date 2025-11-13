/** Checks if a value is empty (null, undefined, or whitespace). */
export const isEmptyValue = (value: unknown): value is "" | null | undefined =>
  value == null || (typeof value === "string" && value.trim() === "");
