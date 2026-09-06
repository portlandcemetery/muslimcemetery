"use client";

import { parseAsString, useQueryState } from "nuqs";
import type { UserRole } from "@/lib/types";
import type { GardenInfo, Row } from "./garden-data";
import { GardenHeader } from "./garden-header";
import { GardenMap } from "./garden-map";

export function GardenView({
  gardens,
  gardenId,
  rows,
  role,
}: {
  gardens: GardenInfo[];
  gardenId: string;
  rows: Row[];
  role: UserRole;
}) {
  const [, setGardenId] = useQueryState(
    "garden",
    // shallow:false re-runs the server page so the map data refetches
    parseAsString.withDefault(gardens[0]?.id ?? "a").withOptions({ shallow: false })
  );
  const garden = gardens.find((g) => g.id === gardenId) ?? gardens[0];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <GardenHeader
        garden={garden}
        gardens={gardens}
        onGardenChange={setGardenId}
        showMine={role === "viewer"}
      />
      <GardenMap
        key={garden.id}
        rows={rows}
        gardenId={garden.id}
        isAdmin={role === "admin"}
        canFocusMine={role === "viewer"}
      />
    </div>
  );
}
