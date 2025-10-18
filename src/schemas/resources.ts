import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/config/constants";
import {
  DepartmentIds,
  LinkType,
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
  RelatedResource,
  Resource,
} from "@/config/enums";
import {
  colorField,
  isoTimestamp,
  numericId,
  requiredString,
} from "@/lib/helpers";
import type { AppZodObject } from "@/types/app";

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

export const RELATED_RESOURCE_SCHEMAS = {
  [RelatedResource.StudentOrganizationLinks]: StudentOrganizationLinkSchema,
  [RelatedResource.StudentOrganizationTags]: StudentOrganizationTagSchema,
  [RelatedResource.GuideAuthors]: GuideAuthorSchema,
} satisfies Record<RelatedResource, AppZodObject>;

export const RESOURCE_SCHEMAS = {
  [Resource.GuideArticles]: GuideArticleSchema,
  [Resource.StudentOrganizations]: StudentOrganizationSchema,
  [Resource.CalendarEvents]: EventCalendarSchema,
  [Resource.Banners]: BannerSchema,
} satisfies Record<Resource, AppZodObject>;
