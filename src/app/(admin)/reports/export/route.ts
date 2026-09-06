import type { NextRequest } from "next/server";
import { getSessionProfile } from "@/lib/data/auth";
import { isStaff } from "@/lib/types";
import { buildReportCsv, isReportType } from "@/lib/data/reports";

export async function GET(request: NextRequest) {
  const profile = await getSessionProfile();
  if (!profile || !isStaff(profile.role)) {
    return new Response("Forbidden", { status: 403 });
  }

  const type = request.nextUrl.searchParams.get("type");
  if (!isReportType(type)) {
    return new Response("Unknown report type", { status: 400 });
  }

  const { filename, csv } = await buildReportCsv(type);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
