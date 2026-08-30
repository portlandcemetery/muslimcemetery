"use client";

import { useMemo, useState } from "react";
import { GARDENS, buildRows } from "./garden-data";
import { GardenHeader } from "./garden-header";
import { GardenMap } from "./garden-map";

export function GardenView() {
  const [gardenId, setGardenId] = useState(GARDENS[0].id);
  const garden = GARDENS.find((g) => g.id === gardenId) ?? GARDENS[0];
  const rows = useMemo(() => buildRows(garden.seed), [garden]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <GardenHeader garden={garden} onGardenChange={setGardenId} />
      <GardenMap key={garden.id} rows={rows} />
    </div>
  );
}
