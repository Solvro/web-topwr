import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes: Record<string, string[] | undefined> = {
  "/login": [],
  "/": ["user", "admin"],
  "/guide_articles": ["user", "admin"],
  "/student_organizations": ["user", "admin"],
};

function getUserPermissions(request: NextRequest): string[] {
  const permissions = request.cookies.get("permissions")?.value;
  return permissions == null ? [] : permissions.split(",");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const firstSegment = pathname.split("/")[1];
  const requiredPermissions = protectedRoutes[`/${firstSegment}`] ?? ["admin"];

  if (requiredPermissions.length > 0) {
    const userPermissions = getUserPermissions(request);

    const hasPermission = requiredPermissions.some((perm) =>
      userPermissions.includes(perm),
    );

    if (!hasPermission) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Allow request to proceed
  return NextResponse.next();
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
