import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/config/constants";
import {
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
  Resource,
} from "@/config/enums";
import { requiredString } from "@/lib/helpers";
import type { AppZodObject } from "@/types/app";

const StudentOrganizationSchema = z.object({
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

const GuideArticleSchema = z.object({
  title: requiredString(),
  imageKey: requiredString(),
  shortDesc: requiredString(),
  description: requiredString(),
});

export const RESOURCE_SCHEMAS: Record<Resource, AppZodObject> = {
  [Resource.GuideArticles]: GuideArticleSchema,
  [Resource.StudentOrganizations]: StudentOrganizationSchema,
};
