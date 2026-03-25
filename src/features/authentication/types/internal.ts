/**
 * This module contains types only used **internally** within the auth feature,
 * not to be re-exported or imported outside of its root directory.
 */
import type { z } from "zod";

import type { ROUTE_PERMISSIONS } from "../data/route-permissions";
import type { AuthStateSchema } from "../schemas/auth-state-schema";
import type { LoginSchema } from "../schemas/login-schema";
import type { UserSchema } from "../schemas/user-schema";

export type RoutePermission = keyof typeof ROUTE_PERMISSIONS;

export type AuthState = z.infer<typeof AuthStateSchema>;
export type LoginFormValues = z.infer<typeof LoginSchema>;
export type User = z.infer<typeof UserSchema>;

export type TokenStatus = "ok" | "expiring-soon" | "expired" | "both-expired";
