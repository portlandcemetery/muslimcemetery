import { Suspense } from "react";
import { GardenView } from "@/components/gardens/garden-view";

export default function GardensPage() {
  return (
    <Suspense>
      <GardenView />
    </Suspense>
  );
}
