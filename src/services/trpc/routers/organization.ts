import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@/services/db/index";
import { organizationSettings } from "@/services/db/schema";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/services/trpc/init";
import { insertActivity } from "@/services/trpc/lib/helpers";
import type { OrganizationSettings } from "@/lib/types";

const EMPTY: OrganizationSettings = {
  org_name: "",
  cemetery_name: "",
  contact_email: "",
  phone: "",
};

export const organizationRouter = createTRPCRouter({
  get: protectedProcedure.query(async (): Promise<OrganizationSettings> => {
    const [row] = await db
      .select({
        org_name: organizationSettings.org_name,
        cemetery_name: organizationSettings.cemetery_name,
        contact_email: organizationSettings.contact_email,
        phone: organizationSettings.phone,
      })
      .from(organizationSettings)
      .where(eq(organizationSettings.id, 1))
      .limit(1);
    return row ?? EMPTY;
  }),

  save: adminProcedure
    .input(
      z.object({
        org_name: z.string().trim().min(1, "Organization name is required."),
        cemetery_name: z.string().trim().default(""),
        contact_email: z.string().trim().default(""),
        phone: z.string().trim().default(""),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (
        input.contact_email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.contact_email)
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Contact email is not a valid address.",
        });
      }

      await db.transaction(async (tx) => {
        await tx
          .insert(organizationSettings)
          .values({ id: 1, ...input, updated_at: sql`now()` })
          .onConflictDoUpdate({
            target: organizationSettings.id,
            set: { ...input, updated_at: sql`now()` },
          });
        await insertActivity(tx, {
          actorName: ctx.profile.full_name,
          action: "updated organization settings",
          entity: "organization",
        });
      });

      return { savedAt: Date.now() };
    }),
});
