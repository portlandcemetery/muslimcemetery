import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Optimistic coarse gate — the authoritative check is (admin)/layout.tsx.
export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/gardens/:path*",
    "/plots/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};
