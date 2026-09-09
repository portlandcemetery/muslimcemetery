import { createTRPCRouter, protectedProcedure } from "@/services/trpc/init";
import type { Profile } from "@/lib/types";

export const authRouter = createTRPCRouter({
  // Current signed-in profile (role source of truth). Replaces getSessionProfile.
  me: protectedProcedure.query(({ ctx }): Profile => ctx.profile),
});
