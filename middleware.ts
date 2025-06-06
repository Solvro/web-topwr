import { NextRequest, NextResponse } from "next/server";

// Example: Define protected routes and required permissions
const protectedRoutes: Record<string, string[]> = {
  "/admin": ["admin"],
  "/dashboard": ["user", "admin"],
  // Add more routes and required permissions as needed
};

// Helper to extract user permissions from cookies or headers (customize as needed)
function getUserPermissions(req: NextRequest): string[] {
  const permissions = req.cookies.get("permissions")?.value;
  // Example: permissions cookie is a comma-separated string
  return permissions ? permissions.split(",") : [];
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Find if the route is protected
  const requiredPermissions = Object.entries(protectedRoutes).find(([route]) =>
    pathname.startsWith(route),
  )?.[1];

  if (requiredPermissions) {
    const userPermissions = getUserPermissions(req);

    // Check if user has at least one required permission
    const hasPermission = requiredPermissions.some((perm) =>
      userPermissions.includes(perm),
    );

    if (!hasPermission) {
      // Redirect to login page
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Allow request to proceed
  return NextResponse.next();
}

// Optionally, specify which paths to run middleware on
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"], // Add protected routes here
};
