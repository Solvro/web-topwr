import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/config/constants";
import { requiredString } from "@/lib/helpers";

export const LoginSchema = z.object({
  email: z.string({ required_error: FORM_ERROR_MESSAGES.REQUIRED }).email({
    message: FORM_ERROR_MESSAGES.INVALID_EMAIL,
  }),
  password: requiredString(),
  rememberMe: z.boolean(),
});

export const SortFiltersSchema = z
  .object({
    sortBy: requiredString().default("id"),
    sortDirection: z.enum(["asc", "desc"]).default("asc"),
    searchTerm: z.string().default(""),
    searchField: z.string().default(""),
  })
  .superRefine((data, context) => {
    const searchTermIsEmpty = data.searchTerm.trim() === "";
    const searchFieldIsEmpty = data.searchField.trim() === "";
    if (searchTermIsEmpty !== searchFieldIsEmpty) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [searchTermIsEmpty ? "searchTerm" : "searchField"],
        message: FORM_ERROR_MESSAGES.CONDITIONALLY_REQUIRED,
      });
    }
  });
