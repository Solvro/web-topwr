import type { Route } from "next";

import { Resource } from "@/features/resources";
import type { RoutableResource } from "@/features/resources/types";
import type { RecordIntersection } from "@/types/helpers";

const SOLVRO_ADMINS_ONLY = ["solvro_admin"] as const;
const ADMINS_ONLY = ["admin", ...SOLVRO_ADMINS_ONLY] as const;
const ANY_AUTHENTICATED_ROLE = ["user", ...ADMINS_ONLY] as const;

export const ROUTE_PERMISSIONS = {
  "/": ANY_AUTHENTICATED_ROLE,
  "/review": SOLVRO_ADMINS_ONLY,
  "/interactive-map": ANY_AUTHENTICATED_ROLE,
  [`/${Resource.AboutUs}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.AboutUsLinks}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.AcademicSemesters}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.Aeds}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.Banners}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.BicycleShowers}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.Buildings}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.CalendarEvents}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.Campuses}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.Contributors}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.DaySwaps}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.Departments}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.FoodSpots}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.GuideArticles}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.Holidays}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.Libraries}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.Map}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.Milestones}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.MobileConfig}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.Notifications}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.NotificationTopics}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.PinkBoxes}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.PolinkaStations}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.Roles}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.SksOpeningHours}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.StudentOrganizations}`]: ANY_AUTHENTICATED_ROLE,
  [`/${Resource.Versions}`]: ANY_AUTHENTICATED_ROLE,
} satisfies RecordIntersection<
  `/${RoutableResource}`,
  Route,
  readonly string[] | undefined
>;
