import type { Route } from "next";

import { ADMIN_PATH } from "@/config/constants";
import { Resource } from "@/features/resources";
import type { RoutableResource } from "@/features/resources/types";
import type { RecordIntersection } from "@/types/helpers";

const SOLVRO_ADMINS_ONLY = ["solvro_admin"] as const;
const ADMINS_ONLY = ["admin", ...SOLVRO_ADMINS_ONLY] as const;
const ANY_AUTHENTICATED_ROLE = ["user", ...ADMINS_ONLY] as const;

export const ROUTE_PERMISSIONS = {
  "/": ANY_AUTHENTICATED_ROLE,
  [ADMIN_PATH]: ANY_AUTHENTICATED_ROLE,
  "/review": SOLVRO_ADMINS_ONLY,
  [`${ADMIN_PATH}/${Resource.AboutUs}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.AboutUsLinks}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.AcademicSemesters}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.Aeds}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.Banners}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.BicycleShowers}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.Buildings}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.CalendarEvents}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.Campuses}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.Contributors}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.DaySwaps}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.Departments}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.FoodSpots}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.GuideArticles}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.Holidays}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.Libraries}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.Map}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.Milestones}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.MobileConfig}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.Notifications}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.NotificationTopics}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.PinkBoxes}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.PolinkaStations}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.Roles}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.SksOpeningHours}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.StudentOrganizations}`]: ANY_AUTHENTICATED_ROLE,
  [`${ADMIN_PATH}/${Resource.Versions}`]: ANY_AUTHENTICATED_ROLE,
} satisfies RecordIntersection<
  `${typeof ADMIN_PATH}/${RoutableResource}`,
  Route,
  readonly string[] | undefined
>;
