import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import "server-only";

import { AUTH_STATE_COOKIE_NAME } from "@/config/constants";
import { ROUTE_PERMISSIONS } from "@/config/route-permissions";
import type { AuthState, User } from "@/types/api";
import type { RoutePermission } from "@/types/components";

import { parseAuthCookie } from "./cookies";
import { getCurrentUser } from "./helpers";

async function verifyUserCookie(
  cookie: RequestCookie | undefined,
): Promise<AuthState | null> {
  if (cookie == null) {
    return null;
  }
  const authState = parseAuthCookie(cookie.value);
  if (authState == null) {
    return null;
  }
  let user: User;
  try {
    user = await getCurrentUser(authState.accessToken);
  } catch (error) {
    console.warn("Invalid token in cookie:", error);
    return null;
  }
  return { ...authState, user };
}

/**
 * Obtains the auth state directly from the request cookies. Only works in React server components.
 * @see {@link @/hooks/use-auth.ts#useAuth} for the React client hook version.
 * @see {@link @/stores/auth.ts#getAuthState} for the non-component version.
 */
export const getAuthState = cache(async () => {
  const allCookies = await cookies();
  const cookie = allCookies.get(AUTH_STATE_COOKIE_NAME);
  const authState = await verifyUserCookie(cookie);
  return authState;
});

function getUserPermissions(user: User | null): string[] {
  if (user == null) {
    return [];
  }
  // TODO: update this when the backend supports user roles
  const roles = ["user"];
  // if (user.email.endsWith("@solvro.pl")) {
  //   roles.push("admin");
  // }
  return roles;
}

/**
 * Returns the route permissions, defaulting to an empty array in case the route's permissions are not specified.
 * The route permissions configuration is typed to include all routable resources, so this is enforced by TypeScript,
 * but during development it helps by displaying a 403 Forbidden error rather than a runtime error in case of missing routes.
 */
const getRoutePermissions = (route: RoutePermission): string[] =>
  (ROUTE_PERMISSIONS[route] as string[] | undefined) ?? [];

/* Determines whether or not the user is permitted to access the given route segment. */
export const permit = cache(async (route: RoutePermission) => {
  const requiredPermissions = getRoutePermissions(route);
  if (requiredPermissions.length === 0) {
    // ensures that the route has defined permissions
    return false;
  }

  const authState = await getAuthState();
  if (authState == null) {
    redirect("/login");
  }

  const userPermissions = getUserPermissions(authState.user);
  const hasPermission = requiredPermissions.some((perm) =>
    userPermissions.includes(perm),
  );

  return hasPermission;
});
