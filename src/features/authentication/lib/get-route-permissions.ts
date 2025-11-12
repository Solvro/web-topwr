import { ROUTE_PERMISSIONS } from "../data/route-permissions";
import type { RoutePermission } from "../types/internal";

/**
 * Returns the route permissions, defaulting to an empty array in case the route's permissions are not specified.
 * The route permissions configuration is typed to include all routable resources, so this is enforced by TypeScript,
 * but during development it helps by displaying a 403 Forbidden error rather than a runtime error in case of missing routes.
 */
export const getRoutePermissions = (route: RoutePermission): string[] =>
  (ROUTE_PERMISSIONS[route] as string[] | undefined) ?? [];
