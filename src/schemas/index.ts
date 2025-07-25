import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/config/constants";
import {
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
} from "@/config/enums";
import { requiredString } from "@/lib/helpers";

export const LoginSchema = z.object({
  email: z.string({ required_error: FORM_ERROR_MESSAGES.REQUIRED }).email({
    message: FORM_ERROR_MESSAGES.INVALID_EMAIL,
  }),
  password: requiredString(),
  rememberMe: z.boolean(),
});

export const StudentOrganizationSchema = z.object({
  name: requiredString(),
  departmentId: z.number().int().positive().nullable().optional(),
  logoKey: z.string().nullable().optional(),
  coverKey: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  coverPreview: z.boolean({ required_error: FORM_ERROR_MESSAGES.REQUIRED }),
  source: z.nativeEnum(OrganizationSource, {
    required_error: FORM_ERROR_MESSAGES.REQUIRED,
  }),
  organizationType: z.nativeEnum(OrganizationType, {
    required_error: FORM_ERROR_MESSAGES.REQUIRED,
  }),
  organizationStatus: z.nativeEnum(OrganizationStatus, {
    required_error: FORM_ERROR_MESSAGES.REQUIRED,
  }),
  isStrategic: z.boolean({ required_error: FORM_ERROR_MESSAGES.REQUIRED }),
});

export const GuideArticleSchema = z.object({
  title: requiredString(),
  imageKey: requiredString(),
  shortDesc: requiredString(),
  description: requiredString(),
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
