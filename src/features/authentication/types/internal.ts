import type {
  RequestCookie as NextRequestCookie,
  ResponseCookie as NextResponseCookie,
} from "next/dist/compiled/@edge-runtime/cookies";
import type { z } from "zod";

import type { ROUTE_PERMISSIONS } from "../data/route-permissions";
import type { AuthStateSchema } from "../schemas/auth-state-schema";
import type { UserSchema } from "../schemas/user-schema";

export type RequestCookie = NextRequestCookie;
export type ResponseCookie = NextResponseCookie;

export type CookieOptions = Partial<ResponseCookie> & Cookies.CookieAttributes;

export type RoutePermission = keyof typeof ROUTE_PERMISSIONS;

export type User = z.infer<typeof UserSchema>;
export type AuthState = z.infer<typeof AuthStateSchema>;
