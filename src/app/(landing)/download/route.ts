import type { NextRequest } from "next/server";
import { NextResponse, userAgent } from "next/server";

import { getMobileAppStoreLink } from "@/features/landing-page";

export function GET(request: NextRequest) {
  const { os } = userAgent(request);
  const mobileAppStoreLink = getMobileAppStoreLink(os.name);
  return NextResponse.redirect(
    mobileAppStoreLink?.href ?? new URL("/", request.url),
  );
}
