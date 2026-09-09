import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/services/db/index";
import { gardens, plotRepresentatives, plots } from "@/services/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/services/trpc/init";
import type { MapPlot } from "@/lib/types";

export type GardenInfo = { id: string; name: string; arabic: string };

const MAP_COLS = {
  id: plots.id,
  garden_id: plots.garden_id,
  col_letter: plots.col_letter,
  row_letter: plots.row_letter,
  position: plots.position,
  ref: plots.ref,
  status: plots.status,
  deceased_name: plots.deceased_name,
};

export const gardensRouter = createTRPCRouter({
  list: protectedProcedure.query(async (): Promise<GardenInfo[]> => {
    const rows = await db
      .select({
        id: gardens.id,
        name: gardens.name,
        arabic: gardens.arabic_name,
      })
      .from(gardens)
      .orderBy(asc(gardens.sort_order));
    return rows;
  }),

  // Existing plot rows for a garden (sparse). Viewers only see plots mapped to
  // them; the client fills every other cell as "available".
  map: protectedProcedure
    .input(z.object({ gardenId: z.string() }))
    .query(async ({ input, ctx }): Promise<MapPlot[]> => {
      if (ctx.profile.role === "viewer") {
        return db
          .select(MAP_COLS)
          .from(plots)
          .innerJoin(
            plotRepresentatives,
            and(
              eq(plotRepresentatives.plot_id, plots.id),
              eq(plotRepresentatives.profile_id, ctx.profile.id)
            )
          )
          .where(eq(plots.garden_id, input.gardenId)) as Promise<MapPlot[]>;
      }
      return db
        .select(MAP_COLS)
        .from(plots)
        .where(eq(plots.garden_id, input.gardenId)) as Promise<MapPlot[]>;
    }),

  myPlotIds: protectedProcedure.query(async ({ ctx }): Promise<string[]> => {
    const rows = await db
      .select({ plot_id: plotRepresentatives.plot_id })
      .from(plotRepresentatives)
      .where(eq(plotRepresentatives.profile_id, ctx.profile.id));
    return rows.map((r) => r.plot_id);
  }),
});
