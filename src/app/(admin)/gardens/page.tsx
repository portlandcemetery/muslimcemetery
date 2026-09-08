import { Suspense } from "react";
import { GardenView } from "@/components/gardens/garden-view";
import { getGardens, getMapRows, getMyPlotIds } from "@/lib/data/gardens";
import { requireProfile } from "@/lib/data/auth";
import { isStaff } from "@/lib/types";

export default async function GardensPage({
  searchParams,
}: {
  searchParams: Promise<{ garden?: string }>;
}) {
  const [profile, gardens, params] = await Promise.all([
    requireProfile(),
    getGardens(),
    searchParams,
  ]);

  if (gardens.length === 0) {
    throw new Error("No gardens configured.");
  }
  const gardenId = gardens.some((g) => g.id === params.garden)
    ? params.garden!
    : gardens[0].id;
  const minePlotIds = isStaff(profile.role) ? undefined : await getMyPlotIds();
  const rows = await getMapRows(gardenId, minePlotIds);

  return (
    <Suspense>
      <GardenView
        gardens={gardens}
        gardenId={gardenId}
        rows={rows}
        role={profile.role}
      />
    </Suspense>
  );
}
