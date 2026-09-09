import { desc } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/services/db/index";
import { activityLog } from "@/services/db/schema";
import { getGardenCounts, type GardenCounts } from "@/services/db/aggregates";
import {
  createTRPCRouter,
  protectedProcedure,
  staffProcedure,
} from "@/services/trpc/init";
import type { ActivityEntry } from "@/lib/types";

export const dashboardRouter = createTRPCRouter({
  gardenCounts: staffProcedure.query(
    async (): Promise<GardenCounts[]> => getGardenCounts()
  ),

  recentActivity: protectedProcedure
    .input(z.object({ limit: z.number().default(8) }).optional())
    .query(async ({ input }): Promise<ActivityEntry[]> => {
      const rows = await db
        .select()
        .from(activityLog)
        .orderBy(desc(activityLog.created_at))
        .limit(input?.limit ?? 8);
      return rows as ActivityEntry[];
    }),
});
