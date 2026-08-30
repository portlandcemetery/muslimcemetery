import { ReportStats } from "@/components/reports/report-stats";
import { DisasterRecovery } from "@/components/reports/disaster-recovery";
import { GenerateReport } from "@/components/reports/generate-report";
import { RecentExports } from "@/components/reports/recent-exports";

export default function ReportsPage() {
  return (
    <div className="px-[44px] pt-[38px] pb-[56px]">
      <div className="mb-[30px]">
        <h1 className="font-extrabold text-[38px] tracking-[-0.02em] mb-[6px]">
          Reports &amp; Records
        </h1>
        <p className="text-[15.5px] text-muted-foreground">
          Generate registers, review figures, and safeguard the cemetery archive.
        </p>
      </div>

      <ReportStats />
      <DisasterRecovery />
      <GenerateReport />
      <RecentExports />
    </div>
  );
}
