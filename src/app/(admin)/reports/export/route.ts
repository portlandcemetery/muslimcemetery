import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/services/auth/auth";
import { db } from "@/services/db/index";
import { profiles, reportExports } from "@/services/db/schema";
import { buildReportCsv, isReportType } from "@/services/reports/build-csv";
import { isStaff } from "@/lib/types";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return new Response("Forbidden", { status: 403 });

  const [profile] = await db
    .select({
      id: profiles.id,
      role: profiles.role,
      full_name: profiles.full_name,
      email: profiles.email,
    })
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);
  if (!profile || !isStaff(profile.role)) {
    return new Response("Forbidden", { status: 403 });
  }

  const type = request.nextUrl.searchParams.get("type");
  if (!isReportType(type)) {
    return new Response("Unknown report type", { status: 400 });
  }

  const { filename, csv } = await buildReportCsv(type);

  // Best-effort export history — a failed log must not block the download.
  try {
    await db.insert(reportExports).values({
      report_type: type,
      file_name: filename,
      size_bytes: Buffer.byteLength(csv, "utf-8"),
      exported_by: profile.id,
      exported_by_name: profile.full_name || profile.email,
    });
  } catch {
    // ignore
  }

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
