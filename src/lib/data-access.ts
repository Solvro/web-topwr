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

/* Determines whether or not the user is permitted to access the given route segment. */
export const permit = cache(async (route: RoutePermission) => {
  const requiredPermissions = ROUTE_PERMISSIONS[route];
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
