"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { GardenView } from "@/components/gardens/garden-view";
import { buildRowsFromPlots } from "@/components/gardens/garden-data";
import { PageLoader } from "@/components/page-loader";
import { useTRPC } from "@/services/trpc/client";

export default function GardensPage() {
  const trpc = useTRPC();
  const searchParams = useSearchParams();
  const gardenParam = searchParams.get("garden") ?? undefined;

  const me = useQuery(trpc.auth.me.queryOptions());
  const gardens = useQuery(trpc.gardens.list.queryOptions());

  const list = gardens.data ?? [];
  const gardenId =
    list.find((g) => g.id === gardenParam)?.id ?? list[0]?.id ?? "";

  const role = me.data?.role;
  const viewer = role === "viewer";

  const map = useQuery(
    trpc.gardens.map.queryOptions(
      { gardenId },
      { enabled: !!gardenId && !!role }
    )
  );
  const myIds = useQuery(
    trpc.gardens.myPlotIds.queryOptions(undefined, { enabled: viewer })
  );

  const minePlotIds = useMemo(
    () => (viewer ? new Set(myIds.data ?? []) : undefined),
    [viewer, myIds.data]
  );

  const rows = useMemo(
    () => buildRowsFromPlots(map.data ?? [], minePlotIds),
    [map.data, minePlotIds]
  );

  if (!role || !gardenId) {
    return <PageLoader />;
  }

  return (
    <GardenView
      gardens={list}
      gardenId={gardenId}
      rows={rows}
      role={role}
    />
  );
}
