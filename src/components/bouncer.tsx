import { ApplicationError } from "@/config/enums";
import { permit } from "@/lib/data-access";
import type { LayoutProps, RoutePermission } from "@/types/components";

import { ErrorMessage } from "./error-message";

/**
 * Ensures the currently logged in user has permission to access the specified route.
 * Renders the children if permitted, otherwise shows a 403 error message.
 */
export async function Bouncer({
  children,
  route,
}: LayoutProps & { route: RoutePermission }) {
  const hasPermission = await permit(route);

  return hasPermission ? (
    children
  ) : (
    <ErrorMessage type={ApplicationError.Forbidden} />
  );
}
