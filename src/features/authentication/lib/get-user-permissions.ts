import type { User } from "../types/internal";

export function getUserPermissions(user: User | null): string[] {
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
