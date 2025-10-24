import { z } from "zod";

import {
  FORM_ERROR_MESSAGES,
  SORT_FILTER_DEFAULT_VALUES,
} from "@/config/constants";

import { RequiredStringSchema } from "./helpers";

export const LoginSchema = z.object({
  email: z.string({ required_error: FORM_ERROR_MESSAGES.REQUIRED }).email({
    message: FORM_ERROR_MESSAGES.INVALID_EMAIL,
  }),
  password: RequiredStringSchema,
  rememberMe: z.boolean(),
});

export const SortFiltersSchema = z
  .object({
    sortBy: z.string().default(SORT_FILTER_DEFAULT_VALUES.sortBy),
    sortDirection: z
      .enum(["asc", "desc"])
      .default(SORT_FILTER_DEFAULT_VALUES.sortDirection),
    searchField: z.string().default(SORT_FILTER_DEFAULT_VALUES.searchField),
    searchTerm: z.string().default(SORT_FILTER_DEFAULT_VALUES.searchTerm),
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
