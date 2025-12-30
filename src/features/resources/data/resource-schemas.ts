import type { AppSchema } from "@/types/schemas";

import { Resource } from "../enums";
import { AboutUsLinkSchema } from "../schemas/about-us-link-schema";
import { AboutUsSchema } from "../schemas/about-us-schema";
import { AcademicSemesterSchema } from "../schemas/academic-semester-schema";
import { AedSchema } from "../schemas/aed-schema";
import { BannerSchema } from "../schemas/banner-schema";
import { BicycleShowerSchema } from "../schemas/bicycle-shower-schema";
import { BuildingSchema } from "../schemas/building-schema";
import { CalendarEventSchema } from "../schemas/calendar-event-schema";
import { CampusSchema } from "../schemas/campus-schema";
import { ChangeScreenshotsSchema } from "../schemas/change-screenshots-schema";
import { ChangesSchema } from "../schemas/changes-schema";
import { ContributorSchema } from "../schemas/contributor-schema";
import { ContributorSocialLinkSchema } from "../schemas/contributor-social-link-schema";
import { DaySwapSchema } from "../schemas/day-swap-schema";
import { DepartmentLinkSchema } from "../schemas/department-link-schema";
import { DepartmentSchema } from "../schemas/department-schema";
import { FoodSpotSchema } from "../schemas/food-spot-schema";
import { GuideArticleSchema } from "../schemas/guide-article-schema";
import { GuideAuthorSchema } from "../schemas/guide-author-schema";
import { GuideQuestionSchema } from "../schemas/guide-question-schema";
import { HolidaySchema } from "../schemas/holiday-schema";
import { LibrarySchema } from "../schemas/library-schema";
import { MajorSchema } from "../schemas/major-schema";
import { MilestonesSchema } from "../schemas/milestones-schema";
import { MobileConfigSchema } from "../schemas/mobile-config-schema";
import { NotificationSchema } from "../schemas/notification-schema";
import { NotificationTopicSchema } from "../schemas/notification-topic-schema";
import { PinkBoxSchema } from "../schemas/pink-box-schema";
import { PolinkaStationSchema } from "../schemas/polinka-station-schema";
import { RegularHourSchema } from "../schemas/regular-hour-schema";
import { RoleSchema } from "../schemas/role-schema";
import { SksOpeningHoursSchema } from "../schemas/sks-opening-hours-schema";
import { SpecialHourSchema } from "../schemas/special-hour-schema";
import { StudentOrganizationLinkSchema } from "../schemas/student-organization-link-schema";
import { StudentOrganizationSchema } from "../schemas/student-organization-schema";
import { StudentOrganizationTagSchema } from "../schemas/student-organization-tag-schema";
import { VersionScreenshotsSchema } from "../schemas/version-screenshots-schema";
import { VersionsSchema } from "../schemas/versions-schema";

export const RESOURCE_SCHEMAS = {
  [Resource.AboutUs]: AboutUsSchema,
  [Resource.AboutUsLinks]: AboutUsLinkSchema,
  [Resource.AcademicSemesters]: AcademicSemesterSchema,
  [Resource.Aeds]: AedSchema,
  [Resource.Banners]: BannerSchema,
  [Resource.BicycleShowers]: BicycleShowerSchema,
  [Resource.Buildings]: BuildingSchema,
  [Resource.CalendarEvents]: CalendarEventSchema,
  [Resource.Campuses]: CampusSchema,
  [Resource.Changes]: ChangesSchema,
  [Resource.ChangeScreenshots]: ChangeScreenshotsSchema,
  [Resource.Contributors]: ContributorSchema,
  [Resource.ContributorSocialLinks]: ContributorSocialLinkSchema,
  [Resource.DaySwaps]: DaySwapSchema,
  [Resource.Departments]: DepartmentSchema,
  [Resource.DepartmentLinks]: DepartmentLinkSchema,
  [Resource.FoodSpots]: FoodSpotSchema,
  [Resource.GuideArticles]: GuideArticleSchema,
  [Resource.GuideAuthors]: GuideAuthorSchema,
  [Resource.GuideQuestions]: GuideQuestionSchema,
  [Resource.Holidays]: HolidaySchema,
  [Resource.Libraries]: LibrarySchema,
  [Resource.Majors]: MajorSchema,
  [Resource.Milestones]: MilestonesSchema,
  [Resource.MobileConfig]: MobileConfigSchema,
  [Resource.Notifications]: NotificationSchema,
  [Resource.NotificationTopics]: NotificationTopicSchema,
  [Resource.PinkBoxes]: PinkBoxSchema,
  [Resource.PolinkaStations]: PolinkaStationSchema,
  [Resource.RegularHours]: RegularHourSchema,
  [Resource.Roles]: RoleSchema,
  [Resource.SksOpeningHours]: SksOpeningHoursSchema,
  [Resource.SpecialHours]: SpecialHourSchema,
  [Resource.StudentOrganizations]: StudentOrganizationSchema,
  [Resource.StudentOrganizationLinks]: StudentOrganizationLinkSchema,
  [Resource.StudentOrganizationTags]: StudentOrganizationTagSchema,
  [Resource.Versions]: VersionsSchema,
  [Resource.VersionScreenshots]: VersionScreenshotsSchema,
} satisfies Record<Resource, AppSchema>;
