import type { User } from "../types/internal";
import { isSolvroAdmin } from "./is-solvro-admin";

/** Whether the user has to submit changes as drafts. Only Solvro admins modify resources directly. */
export const mustUseDrafts = (user: User | null) => !isSolvroAdmin(user);
