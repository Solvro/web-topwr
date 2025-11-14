import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  AUTH_STATE_COOKIE_NAME,
  parseAuthCookie,
} from "@/features/authentication";

/** Removes the auth cookie if it is malformed. */
function verifyUserCookie(request: NextRequest, response: NextResponse) {
  const cookie = request.cookies.get(AUTH_STATE_COOKIE_NAME);
  if (cookie == null) {
    return;
  }
  const authState = parseAuthCookie(cookie.value);
  if (authState == null) {
    response.cookies.delete(AUTH_STATE_COOKIE_NAME);
  }
}

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  verifyUserCookie(request, response);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - [slug].png (all .png files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|[^/]+.png).*)",
  ],
};
