import "server-only";

import { ErrorMessage } from "@/components/presentation/error-message";
import { ADMIN_PATH } from "@/config/constants";
import { ApplicationError } from "@/config/enums";
import type { RouteOrResource, WrapperProps } from "@/types/components";

import { permit } from "../utils/permit";

/**
 * Ensures the currently logged in user has permission to access the specified route or resource.
 * Renders the children if permitted, otherwise shows a 403 error message.
 */
export async function Bouncer({
  children,
  route,
  resource,
}: WrapperProps & RouteOrResource) {
  const routePermission = route ?? `${ADMIN_PATH}/${resource}`;
  const hasPermission = await permit(routePermission);

  return hasPermission ? (
    children
  ) : (
    <ErrorMessage type={ApplicationError.Forbidden} />
  );
}
