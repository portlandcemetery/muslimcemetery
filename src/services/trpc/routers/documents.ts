import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/services/db/index";
import { documents, plots } from "@/services/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/services/trpc/init";
import type { PlotDocument } from "@/lib/types";

// Phase 2 (Cloudflare R2): upload/download/delete are deferred. This read path
// is functional so the plot page compiles and lists any existing rows.
export const documentsRouter = createTRPCRouter({
  listByPlot: protectedProcedure
    .input(z.object({ gardenId: z.string(), ref: z.string() }))
    .query(async ({ input }): Promise<PlotDocument[]> => {
      const [plot] = await db
        .select({ id: plots.id })
        .from(plots)
        .where(
          and(
            eq(plots.garden_id, input.gardenId),
            eq(plots.ref, input.ref.toUpperCase())
          )
        )
        .limit(1);
      if (!plot) return [];
      return db
        .select()
        .from(documents)
        .where(eq(documents.plot_id, plot.id))
        .orderBy(asc(documents.created_at)) as Promise<PlotDocument[]>;
    }),
});
