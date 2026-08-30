import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PlotSearch } from "@/components/dashboard/plot-search";
import { StatCards } from "@/components/dashboard/stat-cards";
import { GardenAllocation } from "@/components/dashboard/garden-allocation";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader />
      <PlotSearch />
      <StatCards />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        <GardenAllocation />
        <RecentActivity />
      </div>
    </>
  );
}
