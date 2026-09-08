import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getSessionProfile } from "@/lib/data/auth";
import { createClient } from "@/lib/supabase/server";
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

  // Log the export so Recent Exports shows real history (best-effort —
  // a failed log must not block the download)
  const supabase = await createClient();
  await supabase.from("report_exports").insert({
    report_type: type,
    file_name: filename,
    size_bytes: Buffer.byteLength(csv, "utf-8"),
    exported_by: profile.id,
    exported_by_name: profile.full_name || profile.email,
  });
  revalidatePath("/reports");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
