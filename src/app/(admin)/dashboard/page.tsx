"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PlotSearch } from "@/components/dashboard/plot-search";
import { StatCards } from "@/components/dashboard/stat-cards";
import { GardenAllocation } from "@/components/dashboard/garden-allocation";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { PageLoader } from "@/components/page-loader";
import { useTRPC } from "@/services/trpc/client";
import { isStaff } from "@/lib/types";

export default function DashboardPage() {
  const trpc = useTRPC();
  const router = useRouter();
  const me = useQuery(trpc.auth.me.queryOptions());
  const allowed = !!me.data && isStaff(me.data.role);

  useEffect(() => {
    if (me.data && !isStaff(me.data.role)) router.replace("/gardens");
  }, [me.data, router]);

  const counts = useQuery(
    trpc.dashboard.gardenCounts.queryOptions(undefined, { enabled: allowed })
  );
  const activity = useQuery(
    trpc.dashboard.recentActivity.queryOptions({ limit: 8 }, { enabled: allowed })
  );

  const gardens = counts.data ?? [];
  const stats = gardens.reduce(
    (acc, g) => ({
      total: acc.total + g.total,
      occupied: acc.occupied + g.occupied,
      reserved: acc.reserved + g.reserved,
      available: acc.available + g.available,
    }),
    { total: 0, occupied: 0, reserved: 0, available: 0 }
  );

  if (!allowed) {
    return <PageLoader />;
  }

  return (
    <div className="px-5 sm:px-8 lg:px-[44px] pt-6 sm:pt-[38px] pb-[56px]">
      <DashboardHeader />
      <PlotSearch />
      <StatCards stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        <GardenAllocation gardens={gardens} />
        <RecentActivity entries={activity.data ?? []} />
      </div>
    </div>
  );
}
