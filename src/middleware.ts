import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AUTH_STATE_COOKIE_NAME } from "@/config/constants";
import { getCookieOptions, parseAuthCookie } from "@/lib/cookies";
import { fetchQuery } from "@/lib/fetch-utils";
import type { User } from "@/types/api";

import { Resource } from "./lib/enums";

const REQUIRED_ROUTE_PERMISSIONS: Record<string, string[] | undefined> = {
  "/login": [],
  "/": ["user", "admin"],
  [`/${Resource.GuideArticles}`]: ["user", "admin"],
  [`/${Resource.StudentOrganizations}`]: ["user", "admin"],
  "/change_review": ["admin"],
};

async function verifyUserCookie(
  request: NextRequest,
  response: NextResponse,
): Promise<User | null> {
  const cookie = request.cookies.get(AUTH_STATE_COOKIE_NAME);
  if (cookie == null) {
    return null;
  }
  const authState = parseAuthCookie(cookie.value);
  if (authState == null) {
    response.cookies.delete(AUTH_STATE_COOKIE_NAME);
    return null;
  }
  let user: User;
  try {
    user = await fetchQuery<User>("/auth/me", {
      accessTokenOverride: authState.token,
    });
  } catch (error) {
    console.warn("Invalid token in cookie:", error);
    response.cookies.delete(AUTH_STATE_COOKIE_NAME);
    return null;
  }
  // update the client user data in case it changed on the backend
  response.cookies.set(
    AUTH_STATE_COOKIE_NAME,
    ...getCookieOptions(authState, user),
  );
  return user;
}

function getUserPermissions(user: User | null): string[] {
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

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  const redirect = (
    to: string,
    method: "redirect" | "rewrite" = "redirect",
  ) => {
    console.warn(`${method} from ${pathname} to ${to}`);
    return NextResponse[method](new URL(to, request.url));
  };

  const user = await verifyUserCookie(request, response);
  const firstSegment = pathname.split("/")[1];
  if (user == null && firstSegment !== "login") {
    return redirect("/login");
  }

  const requiredPermissions = REQUIRED_ROUTE_PERMISSIONS[
    `/${firstSegment}`
  ] ?? ["admin"];

  if (requiredPermissions.length > 0) {
    const userPermissions = getUserPermissions(user);

    const hasPermission = requiredPermissions.some((perm) =>
      userPermissions.includes(perm),
    );

    if (!hasPermission) {
      return redirect("/error/403", "rewrite");
    }
  }

  if (firstSegment === "login" && user != null) {
    // TODO?: potential to add a redirect to chosen path via query params
    return redirect("/");
  }

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
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|[^/]+.png).*)",
  ],
  // runtime: "nodejs",
};
