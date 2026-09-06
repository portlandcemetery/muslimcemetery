import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PlotSearch } from "@/components/dashboard/plot-search";
import { StatCards } from "@/components/dashboard/stat-cards";
import { GardenAllocation } from "@/components/dashboard/garden-allocation";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { requireProfile } from "@/lib/data/auth";
import { getGardenCounts, getRecentActivity, sumStats } from "@/lib/data/dashboard";
import { isStaff } from "@/lib/types";

export default async function DashboardPage() {
  const profile = await requireProfile();
  if (!isStaff(profile.role)) redirect("/gardens");

  const [gardens, activity] = await Promise.all([
    getGardenCounts(),
    getRecentActivity(),
  ]);

  return (
    <div className="px-5 sm:px-8 lg:px-[44px] pt-6 sm:pt-[38px] pb-[56px]">
      <DashboardHeader />
      <PlotSearch />
      <StatCards stats={sumStats(gardens)} />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        <GardenAllocation gardens={gardens} />
        <RecentActivity entries={activity} />
      </div>
    </div>
  );
}
