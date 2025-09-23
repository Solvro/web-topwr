import { string, z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/config/constants";
import {
  DepartmentIds,
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
  Resource,
} from "@/config/enums";
import { colorField, isoTimestamp, requiredString } from "@/lib/helpers";

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

const EventCalendarSchema = z.object({
  name: requiredString(),
  startTime: z.date({ required_error: FORM_ERROR_MESSAGES.REQUIRED }),
  endTime: z.date({ required_error: FORM_ERROR_MESSAGES.REQUIRED }),
  description: string(),
  location: requiredString(),
});

const BannerSchema = z.object({
  title: requiredString(),
  description: requiredString(),
  url: z.string().url().nullish(),
  draft: z.boolean().default(true),
  textColor: colorField().nullish(),
  backgroundColor: colorField().nullish(),
  titleColor: colorField().nullish(),
  visibleFrom: isoTimestamp().nullish(),
  visibleUntil: isoTimestamp().nullish(),
  shouldRender: z.boolean().default(false),
});

export const RESOURCE_SCHEMAS = {
  [Resource.GuideArticles]: GuideArticleSchema,
  [Resource.StudentOrganizations]: StudentOrganizationSchema,
  [Resource.CalendarEvents]: EventCalendarSchema,
  [Resource.Banners]: BannerSchema,
} satisfies Record<Resource, z.ZodSchema>;
