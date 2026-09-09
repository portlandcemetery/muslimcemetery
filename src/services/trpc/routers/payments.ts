import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@/services/db/index";
import { payments, plots } from "@/services/db/schema";
import {
  createTRPCRouter,
  protectedProcedure,
  staffProcedure,
} from "@/services/trpc/init";
import { ensurePlot, insertActivity } from "@/services/trpc/lib/helpers";
import type { Payment } from "@/lib/types";

async function findPlotId(gardenId: string, ref: string) {
  const [row] = await db
    .select({ id: plots.id })
    .from(plots)
    .where(and(eq(plots.garden_id, gardenId), eq(plots.ref, ref.toUpperCase())))
    .limit(1);
  return row?.id ?? null;
}

export const paymentsRouter = createTRPCRouter({
  listByPlot: protectedProcedure
    .input(z.object({ gardenId: z.string(), ref: z.string() }))
    .query(async ({ input }): Promise<Payment[]> => {
      const plotId = await findPlotId(input.gardenId, input.ref);
      if (!plotId) return [];
      const rows = await db
        .select()
        .from(payments)
        .where(eq(payments.plot_id, plotId))
        .orderBy(asc(payments.paid_at), asc(payments.created_at));
      return rows.map((r) => ({ ...r, amount: Number(r.amount) })) as Payment[];
    }),

  add: staffProcedure
    .input(
      z.object({
        gardenId: z.string(),
        ref: z.string(),
        amount: z.number().positive().max(99_999_999),
        paid_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date."),
        method: z.enum(["Cash", "Check", "Card", "Other"]),
        received_by: z.string().nullish(),
        reference_no: z.string().nullish(),
        note: z.string().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const amount = Math.round(input.amount * 100) / 100;
      await db.transaction(async (tx) => {
        const plotId = await ensurePlot(tx, input.gardenId, input.ref.toUpperCase());
        await tx.insert(payments).values({
          plot_id: plotId,
          amount: String(amount),
          paid_at: input.paid_at,
          method: input.method,
          received_by: input.received_by?.trim() || null,
          reference_no: input.reference_no?.trim() || null,
          note: input.note?.trim() || null,
          source: "manual",
          created_by: ctx.profile.id,
        });
        await insertActivity(tx, {
          actorName: ctx.profile.full_name,
          action: "recorded payment",
          entity: "payment",
          plotRef: `${input.gardenId}-${input.ref.toUpperCase()}`,
        });
      });
      return { ok: true };
    }),

  remove: staffProcedure
    .input(z.object({ paymentId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const deleted = await db
        .delete(payments)
        .where(eq(payments.id, input.paymentId))
        .returning({ id: payments.id });
      if (!deleted[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Payment not found." });
      }
      await insertActivity(db, {
        actorName: ctx.profile.full_name,
        action: "deleted payment",
        entity: "payment",
      });
      return { ok: true };
    }),
});
