import type { AppSchema } from "@/types/schemas";

import { Resource } from "../enums";
import { AboutUsLinkSchema } from "../schemas/about-us-link-schema";
import { AboutUsSchema } from "../schemas/about-us-schema";
import { BannerSchema } from "../schemas/banner-schema";
import { CalendarEventSchema } from "../schemas/calendar-event-schema";
import { ChangeScreenshotsSchema } from "../schemas/change-screenshots-schema";
import { ChangesSchema } from "../schemas/changes-schema";
import { ContributorSchema } from "../schemas/contributor-schema";
import { ContributorSocialLinkSchema } from "../schemas/contributor-social-link-schema";
import { DepartmentLinkSchema } from "../schemas/department-link-schema";
import { DepartmentSchema } from "../schemas/department-schema";
import { GuideArticleSchema } from "../schemas/guide-article-schema";
import { GuideAuthorSchema } from "../schemas/guide-author-schema";
import { GuideQuestionSchema } from "../schemas/guide-question-schema";
import { MajorSchema } from "../schemas/major-schema";
import { MilestonesSchema } from "../schemas/milestones-schema";
import { NotificationSchema } from "../schemas/notification-schema";
import { NotificationTopicSchema } from "../schemas/notification-topic-schema";
import { RoleSchema } from "../schemas/role-schema";
import { StudentOrganizationLinkSchema } from "../schemas/student-organization-link-schema";
import { StudentOrganizationSchema } from "../schemas/student-organization-schema";
import { StudentOrganizationTagSchema } from "../schemas/student-organization-tag-schema";
import { VersionScreenshotsSchema } from "../schemas/version-screenshots-schema";
import { VersionsSchema } from "../schemas/versions-schema";
import { AcademicSemesterSchema } from "../schemas/academic-semester-schema";
import { DaySwapSchema } from "../schemas/day-swap-schema";
import { HolidaySchema } from "../schemas/holiday-schema";

export const RESOURCE_SCHEMAS = {
  [Resource.AboutUs]: AboutUsSchema,
  [Resource.AboutUsLinks]: AboutUsLinkSchema,
  [Resource.AcademicSemesters]: AcademicSemesterSchema,
  [Resource.Banners]: BannerSchema,
  [Resource.CalendarEvents]: CalendarEventSchema,
  [Resource.Changes]: ChangesSchema,
  [Resource.ChangeScreenshots]: ChangeScreenshotsSchema,
  [Resource.Contributors]: ContributorSchema,
  [Resource.ContributorSocialLinks]: ContributorSocialLinkSchema,
  [Resource.DaySwaps]: DaySwapSchema,
  [Resource.Departments]: DepartmentSchema,
  [Resource.DepartmentLinks]: DepartmentLinkSchema,
  [Resource.GuideArticles]: GuideArticleSchema,
  [Resource.GuideAuthors]: GuideAuthorSchema,
  [Resource.GuideQuestions]: GuideQuestionSchema,
  [Resource.Holidays]: HolidaySchema,
  [Resource.Majors]: MajorSchema,
  [Resource.Milestones]: MilestonesSchema,
  [Resource.Notifications]: NotificationSchema,
  [Resource.NotificationTopics]: NotificationTopicSchema,
  [Resource.Roles]: RoleSchema,
  [Resource.StudentOrganizations]: StudentOrganizationSchema,
  [Resource.StudentOrganizationLinks]: StudentOrganizationLinkSchema,
  [Resource.StudentOrganizationTags]: StudentOrganizationTagSchema,
  [Resource.Versions]: VersionsSchema,
  [Resource.VersionScreenshots]: VersionScreenshotsSchema,
} satisfies Record<Resource, AppSchema>;
