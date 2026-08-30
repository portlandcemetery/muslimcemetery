import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PlotSearch } from "@/components/dashboard/plot-search";
import { StatCards } from "@/components/dashboard/stat-cards";
import { GardenAllocation } from "@/components/dashboard/garden-allocation";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function DashboardPage() {
  return (
    <div className="px-5 sm:px-8 lg:px-[44px] pt-6 sm:pt-[38px] pb-[56px]">
      <DashboardHeader />
      <PlotSearch />
      <StatCards />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        <GardenAllocation />
        <RecentActivity />
      </div>
    </div>
  );
}
