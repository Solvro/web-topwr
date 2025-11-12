import type { User } from "../types";

/** Prefers the user's full name, falling back to their email. */
export const getUserDisplayName = (user: User): string =>
  user.fullName ?? user.email;
