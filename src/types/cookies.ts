import type {
  RequestCookie as NextRequestCookie,
  ResponseCookie as NextResponseCookie,
} from "next/dist/compiled/@edge-runtime/cookies";

export type RequestCookie = NextRequestCookie;
type ResponseCookie = NextResponseCookie;

export type CookieOptions = Partial<ResponseCookie> & Cookies.CookieAttributes;
