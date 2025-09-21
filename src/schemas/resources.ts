import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/config/constants";
import {
  DepartmentIds,
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
  Resource,
} from "@/config/enums";
import { requiredString } from "@/lib/helpers";

const StudentOrganizationSchema = z.object({
  name: requiredString(),
  departmentId: z
    .nativeEnum(DepartmentIds, {
      required_error: FORM_ERROR_MESSAGES.REQUIRED,
    })
    .nullish(),
  logoKey: z.string().nullish(),
  coverKey: z.string().nullish(),
  description: z.string().nullish(),
  shortDescription: z.string().nullish(),
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
  branch: z.enum(["main"]),
});

const GuideArticleSchema = z.object({
  title: requiredString(),
  imageKey: requiredString(),
  shortDesc: requiredString(),
  description: requiredString(),
});

export const RESOURCE_SCHEMAS = {
  [Resource.GuideArticles]: GuideArticleSchema,
  [Resource.StudentOrganizations]: StudentOrganizationSchema,
} satisfies Record<Resource, z.ZodSchema>;
