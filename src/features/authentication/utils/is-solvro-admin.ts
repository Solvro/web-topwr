import { SOLVRO_ADMINS_ONLY } from "../data/permissions";
import type { User } from "../types";
import { getUserPermissions } from "./get-user-permissions";

export const isSolvroAdmin = (user: User | null): boolean => {
  const permissions = getUserPermissions(user);
  return SOLVRO_ADMINS_ONLY.every((role) => permissions.includes(role));
};
