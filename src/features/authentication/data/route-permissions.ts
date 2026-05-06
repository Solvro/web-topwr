import type { Route } from "next";

import { Resource } from "@/features/resources";
import type { RoutableResource } from "@/features/resources/types";
import type { RecordIntersection } from "@/types/helpers";

import { ANY_AUTHENTICATED_ROLE, SOLVRO_ADMINS_ONLY } from "./permissions";

export const ROUTE_PERMISSIONS = {
  "/": ANY_AUTHENTICATED_ROLE,
  "/drafts": ANY_AUTHENTICATED_ROLE,
  "/review": SOLVRO_ADMINS_ONLY,
  [`/${Resource.AboutUs}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.AboutUsLinks}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.AcademicSemesters}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.Aeds}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.Banners}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.BicycleShowers}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.Buildings}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.CalendarEvents}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.Campuses}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.Contributors}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.DaySwaps}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.Departments}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.FoodSpots}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.GuideArticles}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.Holidays}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.Libraries}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.Map}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.Milestones}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.MobileConfig}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.Notifications}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.NotificationTopics}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.PinkBoxes}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.PolinkaStations}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.Roles}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.SksOpeningHours}`]: SOLVRO_ADMINS_ONLY,
  [`/${Resource.StudentOrganizations}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.Versions}`]: SOLVRO_ADMINS_ONLY,
} satisfies RecordIntersection<
  `/${RoutableResource}`,
  Route,
  readonly string[] | undefined
>;
