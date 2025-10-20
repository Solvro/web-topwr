import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/config/constants";
import {
  LinkType,
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
  Resource,
  UniversityBranch,
} from "@/config/enums";
import {
  colorField,
  isoTimestamp,
  numericId,
  requiredString,
} from "@/lib/helpers";
import type { AppZodObject } from "@/types/app";

const DepartmentSchema = z.object({
  name: requiredString(),
  addressLine1: requiredString(),
  addressLine2: requiredString(),
  code: requiredString().regex(/W[0-9]{1,2}[A-Z]?/),
  betterCode: requiredString().regex(/W[A-Z]+/),
  logoKey: requiredString(),
  description: z.string().nullish(),
  gradientStart: colorField(),
  gradientEnd: colorField(),
  branch: z.nativeEnum(UniversityBranch),
});

const StudentOrganizationLinkSchema = z.object({
  linkType: z.nativeEnum(LinkType),
  link: requiredString().url(),
  studentOrganizationId: numericId(),
});

const StudentOrganizationTagSchema = z.object({
  tag: requiredString(),
});

const StudentOrganizationSchema = z.object({
  name: requiredString(),
  departmentId: numericId().nullish(),
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
  branch: z.nativeEnum(UniversityBranch),
});

const GuideArticleSchema = z.object({
  title: requiredString(),
  imageKey: requiredString(),
  shortDesc: requiredString(),
  description: requiredString(),
});

const GuideAuthorSchema = z.object({
  name: requiredString(),
});

const EventCalendarSchema = z.object({
  name: requiredString(),
  startTime: isoTimestamp(),
  endTime: isoTimestamp(),
  description: z.string().nullish(),
  location: z.string().nullish(),
  googleCalId: z.string().nullish(),
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
  [Resource.Departments]: DepartmentSchema,
  [Resource.GuideArticles]: GuideArticleSchema,
  [Resource.GuideAuthors]: GuideAuthorSchema,
  [Resource.StudentOrganizations]: StudentOrganizationSchema,
  [Resource.StudentOrganizationLinks]: StudentOrganizationLinkSchema,
  [Resource.StudentOrganizationTags]: StudentOrganizationTagSchema,
  [Resource.CalendarEvents]: EventCalendarSchema,
  [Resource.Banners]: BannerSchema,
} satisfies Record<Resource, AppZodObject>;
