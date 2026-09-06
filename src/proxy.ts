import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy-session";

export async function proxy(request: NextRequest) {
  return updateSession(request);
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
