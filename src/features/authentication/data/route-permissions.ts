import type { Route } from "next";

import { Resource } from "@/features/resources";
import type { RoutableResource } from "@/features/resources/types";
import type { RecordIntersection } from "@/types/helpers";

export const ROUTE_PERMISSIONS = {
  "/": ["user", "admin"],
  "/review": ["user", "admin"],
  "/interactive-map": ["user", "admin"],
  [`/${Resource.AboutUs}`]: ["user", "admin"],
  [`/${Resource.AboutUsLinks}`]: ["user", "admin"],
  [`/${Resource.AcademicSemesters}`]: ["user", "admin"],
  [`/${Resource.Aeds}`]: ["user", "admin"],
  [`/${Resource.Banners}`]: ["user", "admin"],
  [`/${Resource.BicycleShowers}`]: ["user", "admin"],
  [`/${Resource.Buildings}`]: ["user", "admin"],
  [`/${Resource.CalendarEvents}`]: ["user", "admin"],
  [`/${Resource.Campuses}`]: ["user", "admin"],
  [`/${Resource.Contributors}`]: ["user", "admin"],
  [`/${Resource.DaySwaps}`]: ["user", "admin"],
  [`/${Resource.Departments}`]: ["user", "admin"],
  [`/${Resource.FoodSpots}`]: ["user", "admin"],
  [`/${Resource.GuideArticles}`]: ["user", "admin"],
  [`/${Resource.Holidays}`]: ["user", "admin"],
  [`/${Resource.Libraries}`]: ["user", "admin"],
  [`/${Resource.Map}`]: ["user", "admin"],
  [`/${Resource.Milestones}`]: ["user", "admin"],
  [`/${Resource.MobileConfig}`]: ["user", "admin"],
  [`/${Resource.Notifications}`]: ["user", "admin"],
  [`/${Resource.NotificationTopics}`]: ["user", "admin"],
  [`/${Resource.PinkBoxes}`]: ["user", "admin"],
  [`/${Resource.PolinkaStations}`]: ["user", "admin"],
  [`/${Resource.Roles}`]: ["user", "admin"],
  [`/${Resource.SksOpeningHours}`]: ["user", "admin"],
  [`/${Resource.StudentOrganizations}`]: ["user", "admin"],
  [`/${Resource.Versions}`]: ["user", "admin"],
} satisfies RecordIntersection<
  `/${RoutableResource}`,
  Route,
  string[] | undefined
>;
