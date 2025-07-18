import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/config/constants";
import {
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
} from "@/config/enums";

export const LoginSchema = z.object({
  email: z.string({ required_error: FORM_ERROR_MESSAGES.REQUIRED }).email({
    message: FORM_ERROR_MESSAGES.INVALID_EMAIL,
  }),
  password: z.string().trim().min(1, {
    message: FORM_ERROR_MESSAGES.NONEMPTY,
  }),
  rememberMe: z.boolean(),
});

export const StudentOrganizationSchema = z.object({
  name: z
    .string({ required_error: FORM_ERROR_MESSAGES.REQUIRED })
    .trim()
    .min(1, {
      message: FORM_ERROR_MESSAGES.NONEMPTY,
    }),
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
  title: z
    .string({ required_error: FORM_ERROR_MESSAGES.REQUIRED })
    .trim()
    .min(1, {
      message: FORM_ERROR_MESSAGES.NONEMPTY,
    }),
  imageKey: z.string().nullable().optional(),
  shortDesc: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});
