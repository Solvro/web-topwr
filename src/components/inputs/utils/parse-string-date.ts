import { isValid, parseISO } from "date-fns";

import { StringDateSchema } from "@/schemas";

/** Parses values in yyyy-MM-dd format into a valid Date instance. */
export const parseStringDate = (value: string | null): Date | null => {
  if (value == null || !StringDateSchema.safeParse(value).success) {
    return null;
  }

  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
};
