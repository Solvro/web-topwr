import type { User } from "../types/internal";
import { isAdmin } from "./is-admin";

/** Admins (including Solvro admins) can view and modify all drafts. */
export const canManageAllDrafts = (user: User | null) => isAdmin(user);
