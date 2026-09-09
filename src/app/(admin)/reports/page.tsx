"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ReportStats } from "@/components/reports/report-stats";
import { DisasterRecovery } from "@/components/reports/disaster-recovery";
import { GenerateReport } from "@/components/reports/generate-report";
import { RecentExports } from "@/components/reports/recent-exports";
import { PageLoader } from "@/components/page-loader";
import { useTRPC } from "@/services/trpc/client";
import { isStaff } from "@/lib/types";

export default function ReportsPage() {
  const trpc = useTRPC();
  const router = useRouter();
  const me = useQuery(trpc.auth.me.queryOptions());
  const allowed = !!me.data && isStaff(me.data.role);

  useEffect(() => {
    if (me.data && !isStaff(me.data.role)) router.replace("/gardens");
  }, [me.data, router]);

  const stats = useQuery(
    trpc.reports.stats.queryOptions(undefined, { enabled: allowed })
  );
  const recentExports = useQuery(
    trpc.reports.recentExports.queryOptions(undefined, { enabled: allowed })
  );

  if (!allowed || !stats.data) {
    return <PageLoader />;
  }

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

      <ReportStats stats={stats.data} />
      <DisasterRecovery />
      <GenerateReport />
      <RecentExports exports={recentExports.data ?? []} />
    </div>
  );
}
