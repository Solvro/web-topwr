import type { User } from "../types/internal";
import { isSolvroAdmin } from "./is-solvro-admin";

/** Only Solvro admins can approve drafts. */
export const canApproveDrafts = (user: User | null) => isSolvroAdmin(user);
