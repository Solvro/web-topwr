import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/config/constants";
import {
  ChangeType,
  LinkType,
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
  Resource,
  StudiesType,
  UniversityBranch,
} from "@/config/enums";
import {
  colorField,
  isoTimestamp,
  numericId,
  requiredString,
} from "@/lib/helpers";
import type { AppZodObject } from "@/types/app";

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

const CalendarEventSchema = z.object({
  name: requiredString(),
  startTime: isoTimestamp(),
  endTime: isoTimestamp(),
  description: z.string().nullish(),
  location: z.string().nullish(),
  googleCalId: z.string().nullish(),
});

const DepartmentSchema = z.object({
  name: requiredString(),
  addressLine1: requiredString(),
  addressLine2: requiredString(),
  code: requiredString().regex(/W[0-9]{1,2}[A-Z]?/, {
    message: FORM_ERROR_MESSAGES.INVALID_DEPARTMENT_CODE,
  }),
  betterCode: requiredString().regex(/W[A-Z]+/, {
    message: FORM_ERROR_MESSAGES.INVALID_DEPARTMENT_BETTER_CODE,
  }),
  logoKey: requiredString(),
  description: z.string().nullish(),
  gradientStart: colorField().nullish(),
  gradientStop: colorField().nullish(),
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
  isStrategic: z.boolean(),
  branch: z.nativeEnum(UniversityBranch),
});

const MajorSchema = z.object({
  name: requiredString(),
  url: z.string().url().nullish(),
  isEnglish: z.boolean().default(false),
  studiesType: z.nativeEnum(StudiesType),
  hasWeekendOption: z.boolean().default(false),
  departmentId: numericId(),
});

const VersionsSchema = z.object({
  name: requiredString(),
  description: z.string().nullish(),
  releaseDate: requiredString().datetime(),
  milestoneId: numericId(),
});

const ChangesSchema = z.object({
  name: requiredString(),
  description: requiredString(),
  versionId: numericId(),
  type: z.nativeEnum(ChangeType, {
    required_error: FORM_ERROR_MESSAGES.REQUIRED,
  }),
});

const MilestonesSchema = z.object({
  name: requiredString(),
});

export const RESOURCE_SCHEMAS = {
  [Resource.Banners]: BannerSchema,
  [Resource.CalendarEvents]: CalendarEventSchema,
  [Resource.Departments]: DepartmentSchema,
  [Resource.GuideArticles]: GuideArticleSchema,
  [Resource.GuideAuthors]: GuideAuthorSchema,
  [Resource.StudentOrganizations]: StudentOrganizationSchema,
  [Resource.StudentOrganizationLinks]: StudentOrganizationLinkSchema,
  [Resource.StudentOrganizationTags]: StudentOrganizationTagSchema,
  [Resource.Majors]: MajorSchema,
  [Resource.Versions]: VersionsSchema,
  [Resource.Changes]: ChangesSchema,
  [Resource.Milestones]: MilestonesSchema,
} satisfies Record<Resource, AppZodObject>;
