"use client";

import { useMemo } from "react";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { GARDENS, buildRows } from "./garden-data";
import { GardenHeader } from "./garden-header";
import { GardenMap } from "./garden-map";

const gardenParser = parseAsStringLiteral(
  GARDENS.map((g) => g.id)
).withDefault(GARDENS[0].id);

export function GardenView() {
  const [gardenId, setGardenId] = useQueryState("garden", gardenParser);
  const garden = GARDENS.find((g) => g.id === gardenId) ?? GARDENS[0];
  const rows = useMemo(() => buildRows(garden.seed), [garden]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <GardenHeader garden={garden} onGardenChange={setGardenId} />
      <GardenMap key={garden.id} rows={rows} />
    </div>
  );
}
