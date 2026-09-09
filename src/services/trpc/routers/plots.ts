import { and, eq, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@/services/db/index";
import { plotRepresentatives, plots } from "@/services/db/schema";
import {
  createTRPCRouter,
  protectedProcedure,
  staffProcedure,
} from "@/services/trpc/init";
import { ensurePlot, insertActivity } from "@/services/trpc/lib/helpers";
import type { MapPlot, PlotRow } from "@/lib/types";

const STATUS = z.enum([
  "available",
  "full",
  "partial",
  "unpaid",
  "buried",
  "unavailable",
]);

const REF_RE = /^([A-H])([A-F])([1-4])$/;

function rowToPlot(row: typeof plots.$inferSelect): PlotRow {
  return { ...row, price: Number(row.price) } as PlotRow;
}

// Empty editable plot for a cell that has no row yet (sparse model).
function syntheticPlot(gardenId: string, ref: string): PlotRow {
  const m = REF_RE.exec(ref)!;
  return {
    id: "",
    garden_id: gardenId,
    col_letter: m[1],
    row_letter: m[2],
    position: Number(m[3]),
    ref,
    status: "available",
    price: 0,
    deceased_name: null,
    date_of_birth: null,
    date_of_death: null,
    burial_date: null,
    id_tag_number: null,
    case_number: null,
    county_of_death: null,
    reservation_holder: null,
    purchaser_name: null,
    purchaser_phone: null,
    purchaser_email: null,
    purchaser_address: null,
    notes: null,
    general_note: null,
    updated_at: "",
  };
}

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

const nul = z.string().nullish().transform((v) => {
  const t = (v ?? "").trim();
  return t === "" ? null : t;
});

export const plotsRouter = createTRPCRouter({
  getBySlug: protectedProcedure
    .input(z.object({ gardenId: z.string(), ref: z.string() }))
    .query(async ({ input, ctx }): Promise<PlotRow | null> => {
      const ref = input.ref.toUpperCase();
      if (!REF_RE.test(ref)) return null;

      if (ctx.profile.role === "viewer") {
        // Viewers may only open plots mapped to them.
        const [row] = await db
          .select()
          .from(plots)
          .innerJoin(
            plotRepresentatives,
            and(
              eq(plotRepresentatives.plot_id, plots.id),
              eq(plotRepresentatives.profile_id, ctx.profile.id)
            )
          )
          .where(and(eq(plots.garden_id, input.gardenId), eq(plots.ref, ref)))
          .limit(1);
        return row ? rowToPlot(row.plots) : null;
      }

      const [row] = await db
        .select()
        .from(plots)
        .where(and(eq(plots.garden_id, input.gardenId), eq(plots.ref, ref)))
        .limit(1);
      return row ? rowToPlot(row) : syntheticPlot(input.gardenId, ref);
    }),

  save: staffProcedure
    .input(
      z.object({
        gardenId: z.string(),
        ref: z.string(),
        status: STATUS,
        price: z.number().min(0).max(99_999_999),
        deceased_name: nul,
        date_of_birth: nul,
        date_of_death: nul,
        burial_date: nul,
        id_tag_number: nul,
        case_number: nul,
        county_of_death: nul,
        reservation_holder: nul,
        purchaser_name: nul,
        purchaser_phone: nul,
        purchaser_email: nul,
        purchaser_address: nul,
        notes: nul,
        general_note: nul,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const ref = input.ref.toUpperCase();
      if (!REF_RE.test(ref)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid plot ref." });
      }
      const price = Math.round(input.price * 100) / 100;

      await db.transaction(async (tx) => {
        const [current] = await tx
          .select({ status: plots.status })
          .from(plots)
          .where(and(eq(plots.garden_id, input.gardenId), eq(plots.ref, ref)))
          .limit(1);

        // Only admins may switch a plot INTO unavailable.
        if (
          input.status === "unavailable" &&
          ctx.profile.role !== "admin" &&
          current?.status !== "unavailable"
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only administrators can mark plots unavailable.",
          });
        }

        const plotId = await ensurePlot(tx, input.gardenId, ref);
        await tx
          .update(plots)
          .set({
            status: input.status,
            price: String(price),
            deceased_name: input.deceased_name,
            date_of_birth: input.date_of_birth,
            date_of_death: input.date_of_death,
            burial_date: input.burial_date,
            id_tag_number: input.id_tag_number,
            case_number: input.case_number,
            county_of_death: input.county_of_death,
            reservation_holder: input.reservation_holder,
            purchaser_name: input.purchaser_name,
            purchaser_phone: input.purchaser_phone,
            purchaser_email: input.purchaser_email,
            purchaser_address: input.purchaser_address,
            notes: input.notes,
            general_note: input.general_note,
            updated_at: sql`now()`,
          })
          .where(eq(plots.id, plotId));

        await insertActivity(tx, {
          actorName: ctx.profile.full_name,
          action: "updated plot",
          entity: "plot",
          plotRef: `${input.gardenId}-${ref}`,
        });
      });

      return { savedAt: Date.now() };
    }),

  search: protectedProcedure
    .input(z.object({ query: z.string(), limit: z.number().default(12) }))
    .query(async ({ input, ctx }): Promise<MapPlot[]> => {
      const q = input.query.trim();
      if (!q) return [];
      const like = `%${q}%`;
      const match = or(ilike(plots.ref, like), ilike(plots.deceased_name, like));

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
          .where(match)
          .limit(input.limit) as Promise<MapPlot[]>;
      }
      return db
        .select(MAP_COLS)
        .from(plots)
        .where(match)
        .limit(input.limit) as Promise<MapPlot[]>;
    }),
});
