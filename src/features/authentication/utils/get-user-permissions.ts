import type { User } from "../types/internal";

export function getUserPermissions(user: User | null): string[] {
  if (user == null) {
    return [];
  }
  const roles = ["user", ...user.roles.map((role) => role.slug)];
  return roles;
}
