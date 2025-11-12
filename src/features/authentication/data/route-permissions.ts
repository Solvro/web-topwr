import type { Route } from "next";

import { Resource } from "@/features/resources";
import type { RoutableResource } from "@/features/resources/types";
import type { RecordIntersection } from "@/types/helpers";

export const ROUTE_PERMISSIONS = {
  "/": ["user", "admin"],
  "/review": ["user", "admin"],
  [`/${Resource.AboutUs}`]: ["user", "admin"],
  [`/${Resource.AboutUsLinks}`]: ["user", "admin"],
  [`/${Resource.Banners}`]: ["user", "admin"],
  [`/${Resource.CalendarEvents}`]: ["user", "admin"],
  [`/${Resource.Contributors}`]: ["user", "admin"],
  [`/${Resource.Departments}`]: ["user", "admin"],
  [`/${Resource.GuideArticles}`]: ["user", "admin"],
  [`/${Resource.Milestones}`]: ["user", "admin"],
  [`/${Resource.Notifications}`]: ["user", "admin"],
  [`/${Resource.NotificationTopics}`]: ["user", "admin"],
  [`/${Resource.Roles}`]: ["user", "admin"],
  [`/${Resource.StudentOrganizations}`]: ["user", "admin"],
  [`/${Resource.Versions}`]: ["user", "admin"],
} satisfies RecordIntersection<
  `/${RoutableResource}`,
  Route,
  string[] | undefined
>;
