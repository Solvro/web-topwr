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
import type { AppZodObject } from "@/types/app";

import {
  ColorValueSchema,
  IsoTimestampSchema,
  NumericIdSchema,
  RequiredStringSchema,
} from "./helpers";

const AboutUsSchema = z.object({
  description: RequiredStringSchema,
  coverPhotoKey: RequiredStringSchema,
});

const AboutUsLinkSchema = z.object({
  linkType: z.nativeEnum(LinkType),
  link: RequiredStringSchema.url(),
});

const BannerSchema = z.object({
  title: RequiredStringSchema,
  description: RequiredStringSchema,
  url: z.string().url().nullish(),
  draft: z.boolean().default(true),
  textColor: ColorValueSchema.nullish(),
  backgroundColor: ColorValueSchema.nullish(),
  titleColor: ColorValueSchema.nullish(),
  visibleFrom: IsoTimestampSchema.nullish(),
  visibleUntil: IsoTimestampSchema.nullish(),
  shouldRender: z.boolean().default(false),
});

const CalendarEventSchema = z.object({
  name: RequiredStringSchema,
  startTime: IsoTimestampSchema,
  endTime: IsoTimestampSchema,
  description: z.string().nullish(),
  location: z.string().nullish(),
  googleCalId: z.string().nullish(),
  accentColor: ColorValueSchema.nullish(),
});

const ChangesSchema = z.object({
  name: RequiredStringSchema,
  description: RequiredStringSchema,
  versionId: NumericIdSchema,
  type: z.nativeEnum(ChangeType, {
    required_error: FORM_ERROR_MESSAGES.REQUIRED,
  }),
});

const ContributorSchema = z.object({
  name: RequiredStringSchema,
  photoKey: z.string().nullish(),
});

const ContributorSocialLinkSchema = z.object({
  contributorId: NumericIdSchema,
  linkType: z.nativeEnum(LinkType),
  link: RequiredStringSchema.url(),
});

const DepartmentSchema = z.object({
  name: RequiredStringSchema,
  addressLine1: RequiredStringSchema,
  addressLine2: RequiredStringSchema,
  code: RequiredStringSchema.regex(/W[0-9]{1,2}[A-Z]?/, {
    message: FORM_ERROR_MESSAGES.INVALID_DEPARTMENT_CODE,
  }),
  betterCode: RequiredStringSchema.regex(/W[A-Z]+/, {
    message: FORM_ERROR_MESSAGES.INVALID_DEPARTMENT_BETTER_CODE,
  }),
  logoKey: RequiredStringSchema,
  description: z.string().nullish(),
  gradientStart: ColorValueSchema.nullish(),
  gradientStop: ColorValueSchema.nullish(),
  branch: z.nativeEnum(UniversityBranch),
});

const DepartmentLinkSchema = z.object({
  departmentId: NumericIdSchema,
  linkType: z.nativeEnum(LinkType),
  link: RequiredStringSchema.url(),
  name: RequiredStringSchema,
});

const GuideArticleSchema = z.object({
  title: RequiredStringSchema,
  imageKey: RequiredStringSchema,
  shortDesc: RequiredStringSchema,
  description: RequiredStringSchema,
});

const GuideAuthorSchema = z.object({
  name: RequiredStringSchema,
});

const GuideQuestionSchema = z.object({
  title: RequiredStringSchema,
  answer: RequiredStringSchema,
  articleId: NumericIdSchema,
});

const RoleSchema = z.object({
  name: RequiredStringSchema,
});

const StudentOrganizationLinkSchema = z.object({
  linkType: z.nativeEnum(LinkType),
  link: RequiredStringSchema.url(),
  studentOrganizationId: NumericIdSchema,
});

const StudentOrganizationTagSchema = z.object({
  tag: RequiredStringSchema,
});

const StudentOrganizationSchema = z.object({
  name: RequiredStringSchema,
  departmentId: NumericIdSchema.nullish(),
  logoKey: z.string().nullish(),
  coverKey: z.string().nullish(),
  description: z.string().nullish(),
  shortDescription: z.string().nullish(),
  enName: z.string().nullish(),
  enDescription: z.string().nullish(),
  enShortDescription: z.string().nullish(),
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
  name: RequiredStringSchema,
  url: z.string().url().nullish(),
  isEnglish: z.boolean().default(false),
  studiesType: z.nativeEnum(StudiesType),
  hasWeekendOption: z.boolean().default(false),
  departmentId: NumericIdSchema,
});

const MilestonesSchema = z.object({
  name: RequiredStringSchema,
});

const VersionsSchema = z.object({
  name: RequiredStringSchema,
  description: z.string().nullish(),
  releaseDate: RequiredStringSchema.datetime(),
  milestoneId: NumericIdSchema,
});

export const RESOURCE_SCHEMAS = {
  [Resource.AboutUs]: AboutUsSchema,
  [Resource.AboutUsLinks]: AboutUsLinkSchema,
  [Resource.Banners]: BannerSchema,
  [Resource.CalendarEvents]: CalendarEventSchema,
  [Resource.Changes]: ChangesSchema,
  [Resource.Contributors]: ContributorSchema,
  [Resource.ContributorSocialLinks]: ContributorSocialLinkSchema,
  [Resource.Departments]: DepartmentSchema,
  [Resource.DepartmentLinks]: DepartmentLinkSchema,
  [Resource.GuideArticles]: GuideArticleSchema,
  [Resource.GuideAuthors]: GuideAuthorSchema,
  [Resource.GuideQuestions]: GuideQuestionSchema,
  [Resource.Roles]: RoleSchema,
  [Resource.StudentOrganizations]: StudentOrganizationSchema,
  [Resource.StudentOrganizationLinks]: StudentOrganizationLinkSchema,
  [Resource.StudentOrganizationTags]: StudentOrganizationTagSchema,
  [Resource.Majors]: MajorSchema,
  [Resource.Milestones]: MilestonesSchema,
  [Resource.Versions]: VersionsSchema,
} satisfies Record<Resource, AppZodObject>;
