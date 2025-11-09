import { ApplicationError } from "@/config/enums";
import { permit } from "@/lib/data-access";
import type { RoutableResource } from "@/types/app";
import type { LayoutProps, RoutePermission } from "@/types/components";

import { ErrorMessage } from "./error-message";

/**
 * Ensures the currently logged in user has permission to access the specified route or resource.
 * Renders the children if permitted, otherwise shows a 403 error message.
 */
export async function Bouncer({
  children,
  route,
  resource,
}: LayoutProps &
  (
    | { route: RoutePermission; resource?: never }
    | { route?: never; resource: RoutableResource }
  )) {
  const routePermission = route ?? `/${resource}`;
  const hasPermission = await permit(routePermission);

  return hasPermission ? (
    children
  ) : (
    <ErrorMessage type={ApplicationError.Forbidden} />
  );
}
