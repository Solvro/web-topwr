import { redirect } from "next/navigation";
import { cache } from "react";
import "server-only";

import type { RoutePermission } from "../types/internal";
import { getAuthStateServer } from "./get-auth-state.server";
import { getRoutePermissions } from "./get-route-permissions";
import { getUserPermissions } from "./get-user-permissions";

/* Determines whether or not the user is permitted to access the given route segment. */
export const permit = cache(async (route: RoutePermission) => {
  const requiredPermissions = getRoutePermissions(route);
  if (requiredPermissions.length === 0) {
    // ensures that the route has defined permissions
    return false;
  }

  const authState = await getAuthStateServer();
  if (authState == null) {
    redirect("/login");
  }

  const userPermissions = getUserPermissions(authState.user);
  const hasPermission = requiredPermissions.some((perm) =>
    userPermissions.includes(perm),
  );

  return hasPermission;
});
