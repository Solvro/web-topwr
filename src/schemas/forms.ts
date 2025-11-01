import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/config/constants";
import { SortDirection } from "@/config/enums";

import { RequiredStringSchema } from "./helpers";

export const LoginSchema = z.object({
  email: RequiredStringSchema.email({
    message: FORM_ERROR_MESSAGES.INVALID_EMAIL,
  }),
  password: RequiredStringSchema,
  rememberMe: z.boolean(),
});

export const FilteredFieldSchema = z.object({
  field: z.string(),
  value: z.string(),
});

export const SortFiltersSchema = z.object({
  sortBy: z.string().nullish(),
  sortDirection: z.nativeEnum(SortDirection),
  filters: z.array(FilteredFieldSchema),
});
