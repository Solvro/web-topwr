import { ADMINS_ONLY } from "../data/permissions";
import type { User } from "../types/internal";
import { getUserPermissions } from "./get-user-permissions";

export const isAdmin = (user: User | null): boolean => {
  const permissions = getUserPermissions(user);
  return ADMINS_ONLY.some((role) => permissions.includes(role));
};
