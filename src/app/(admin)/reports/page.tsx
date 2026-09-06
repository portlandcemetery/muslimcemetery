import { ReportStats } from "@/components/reports/report-stats";
import { DisasterRecovery } from "@/components/reports/disaster-recovery";
import { GenerateReport } from "@/components/reports/generate-report";
import { RecentExports } from "@/components/reports/recent-exports";
import { requireRole } from "@/lib/data/auth";
import { getReportStats } from "@/lib/data/reports";

export default async function ReportsPage() {
  await requireRole("admin", "operator");
  const stats = await getReportStats();
  return (
    <div className="px-5 sm:px-8 lg:px-[44px] pt-6 sm:pt-[38px] pb-[56px]">
      <div className="mb-[30px]">
        <h1 className="font-extrabold text-[28px] sm:text-[38px] tracking-[-0.02em] mb-[6px]">
          Reports &amp; Records
        </h1>
        <p className="text-[15.5px] text-muted-foreground">
          Generate registers, review figures, and safeguard the cemetery archive.
        </p>
      </div>

      <ReportStats stats={stats} />
      <DisasterRecovery />
      <GenerateReport />
      <RecentExports />
    </div>
  );
}
