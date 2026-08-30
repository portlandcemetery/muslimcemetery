import { GardenHeader } from "@/components/gardens/garden-header";
import { GardenMap } from "@/components/gardens/garden-map";

export default function GardensPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <GardenHeader />
      <GardenMap />
    </div>
  );
}
