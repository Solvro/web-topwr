import { ErrorMessage } from "@/components/error-message";
import { ApplicationError } from "@/config/enums";
import type { LayoutProps, RouteOrResource } from "@/types/components";

import { permit } from "../lib/permit";

/**
 * Ensures the currently logged in user has permission to access the specified route or resource.
 * Renders the children if permitted, otherwise shows a 403 error message.
 */
export async function Bouncer({
  children,
  route,
  resource,
}: LayoutProps & RouteOrResource) {
  const routePermission = route ?? `/${resource}`;
  const hasPermission = await permit(routePermission);

  return hasPermission ? (
    children
  ) : (
    <ErrorMessage type={ApplicationError.Forbidden} />
  );
}
