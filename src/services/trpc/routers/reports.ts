import { desc } from "drizzle-orm";

import { db } from "@/services/db/index";
import { reportExports } from "@/services/db/schema";
import { getReportStats, type ReportStats } from "@/services/reports/build-csv";
import { createTRPCRouter, staffProcedure } from "@/services/trpc/init";

export type ReportExport = {
  id: number;
  report_type: string;
  file_name: string;
  size_bytes: number | null;
  exported_by_name: string | null;
  created_at: string;
};

export const reportsRouter = createTRPCRouter({
  stats: staffProcedure.query(async (): Promise<ReportStats> => getReportStats()),

  recentExports: staffProcedure.query(async (): Promise<ReportExport[]> => {
    const rows = await db
      .select({
        id: reportExports.id,
        report_type: reportExports.report_type,
        file_name: reportExports.file_name,
        size_bytes: reportExports.size_bytes,
        exported_by_name: reportExports.exported_by_name,
        created_at: reportExports.created_at,
      })
      .from(reportExports)
      .orderBy(desc(reportExports.created_at))
      .limit(6);
    return rows;
  }),
});
