import "server-only";
import { and, asc, eq, gte, inArray, lt } from "drizzle-orm";

import { db } from "@/services/db/index";
import { gardens, plots } from "@/services/db/schema";
import { payments } from "@/services/db/schema";
import {
  getGardenCounts,
  paidByPlot,
  RESERVED,
  sumStats,
} from "@/services/db/aggregates";
import { toCsv, type CsvValue } from "@/lib/csv";

export type ReportType = "occupancy" | "financial" | "burials" | "reservations";

const REPORT_TYPES: readonly ReportType[] = [
  "occupancy",
  "financial",
  "burials",
  "reservations",
];

export function isReportType(value: string | null): value is ReportType {
  return value !== null && (REPORT_TYPES as readonly string[]).includes(value);
}

export type ReportStats = {
  totalPlots: number;
  totalBurials: number;
  burialsThisMonth: number;
  activeReservations: number;
  pendingPayment: number;
  paymentsYtd: number;
  occupancyRate: number;
};

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

async function gardenNames(): Promise<Map<string, string>> {
  const rows = await db
    .select({ id: gardens.id, name: gardens.name })
    .from(gardens);
  return new Map(rows.map((g) => [g.id, g.name]));
}

export async function getReportStats(): Promise<ReportStats> {
  const now = new Date();
  const monthStart = isoDate(
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  );
  const nextMonthStart = isoDate(
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))
  );
  const yearStart = `${now.getUTCFullYear()}-01-01`;

  const [counts, burialsMonthRows, reservedPlots, ytdRows, paid] =
    await Promise.all([
      getGardenCounts(),
      db
        .select({ burial_date: plots.burial_date })
        .from(plots)
        .where(
          and(
            eq(plots.status, "buried"),
            gte(plots.burial_date, monthStart),
            lt(plots.burial_date, nextMonthStart)
          )
        ),
      db
        .select({ id: plots.id, price: plots.price })
        .from(plots)
        .where(inArray(plots.status, RESERVED)),
      db
        .select({ amount: payments.amount })
        .from(payments)
        .where(gte(payments.paid_at, yearStart)),
      paidByPlot(),
    ]);

  const stats = sumStats(counts);
  const pendingPayment = reservedPlots.filter(
    (p) => Number(p.price ?? 0) - (paid.get(p.id) ?? 0) > 0.005
  ).length;
  const paymentsYtd = ytdRows.reduce((s, p) => s + Number(p.amount), 0);

  return {
    totalPlots: stats.total,
    totalBurials: stats.occupied,
    burialsThisMonth: burialsMonthRows.length,
    activeReservations: stats.reserved,
    pendingPayment,
    paymentsYtd,
    occupancyRate: stats.total > 0 ? stats.occupied / stats.total : 0,
  };
}

export async function buildReportCsv(
  type: ReportType
): Promise<{ filename: string; csv: string }> {
  const date = isoDate(new Date());

  switch (type) {
    case "occupancy": {
      const counts = await getGardenCounts();
      const csv = toCsv(
        [
          "Garden ID",
          "Garden",
          "Arabic Name",
          "Total Plots",
          "Occupied",
          "Reserved",
          "Available",
          "Unavailable",
          "Occupancy Rate (%)",
        ],
        counts.map((g) => [
          g.id,
          g.name,
          g.arabic,
          g.total,
          g.occupied,
          g.reserved,
          g.available,
          g.unavailable,
          g.total > 0 ? ((g.occupied / g.total) * 100).toFixed(1) : "0.0",
        ])
      );
      return { filename: `occupancy-by-garden-${date}.csv`, csv };
    }

    case "financial": {
      const [rows, paid, names] = await Promise.all([
        db
          .select({
            id: plots.id,
            garden_id: plots.garden_id,
            ref: plots.ref,
            status: plots.status,
            purchaser_name: plots.purchaser_name,
            reservation_holder: plots.reservation_holder,
            price: plots.price,
          })
          .from(plots)
          .orderBy(asc(plots.garden_id), asc(plots.ref)),
        paidByPlot(),
        gardenNames(),
      ]);
      const csvRows: CsvValue[][] = [];
      for (const p of rows) {
        const totalPaid = paid.get(p.id) ?? 0;
        const active = p.status !== "available" && p.status !== "unavailable";
        if (!active && totalPaid <= 0) continue;
        csvRows.push([
          names.get(p.garden_id) ?? p.garden_id,
          p.ref,
          p.status,
          p.purchaser_name,
          p.reservation_holder,
          Number(p.price ?? 0),
          totalPaid,
          Math.round((Number(p.price ?? 0) - totalPaid) * 100) / 100,
        ]);
      }
      const csv = toCsv(
        [
          "Garden",
          "Plot Ref",
          "Status",
          "Purchaser",
          "Reservation Holder",
          "Price",
          "Total Paid",
          "Outstanding",
        ],
        csvRows
      );
      return { filename: `financial-payments-${date}.csv`, csv };
    }

    case "burials": {
      const [rows, names] = await Promise.all([
        db
          .select({
            garden_id: plots.garden_id,
            ref: plots.ref,
            deceased_name: plots.deceased_name,
            date_of_birth: plots.date_of_birth,
            date_of_death: plots.date_of_death,
            burial_date: plots.burial_date,
            id_tag_number: plots.id_tag_number,
            case_number: plots.case_number,
            county_of_death: plots.county_of_death,
          })
          .from(plots)
          .where(eq(plots.status, "buried"))
          .orderBy(asc(plots.burial_date), asc(plots.ref)),
        gardenNames(),
      ]);
      const csv = toCsv(
        [
          "Garden",
          "Plot Ref",
          "Deceased Name",
          "Date of Birth",
          "Date of Death",
          "Burial Date",
          "ID Tag #",
          "Case #",
          "County of Death",
        ],
        rows.map((p) => [
          names.get(p.garden_id) ?? p.garden_id,
          p.ref,
          p.deceased_name,
          p.date_of_birth,
          p.date_of_death,
          p.burial_date,
          p.id_tag_number,
          p.case_number,
          p.county_of_death,
        ])
      );
      return { filename: `burials-register-${date}.csv`, csv };
    }

    case "reservations": {
      const [rows, paid, names] = await Promise.all([
        db
          .select({
            id: plots.id,
            garden_id: plots.garden_id,
            ref: plots.ref,
            status: plots.status,
            reservation_holder: plots.reservation_holder,
            purchaser_name: plots.purchaser_name,
            purchaser_phone: plots.purchaser_phone,
            purchaser_email: plots.purchaser_email,
            price: plots.price,
          })
          .from(plots)
          .where(inArray(plots.status, RESERVED))
          .orderBy(asc(plots.status), asc(plots.garden_id), asc(plots.ref)),
        paidByPlot(),
        gardenNames(),
      ]);
      const csv = toCsv(
        [
          "Garden",
          "Plot Ref",
          "Status",
          "Reservation Holder",
          "Purchaser",
          "Phone",
          "Email",
          "Price",
          "Total Paid",
          "Outstanding",
        ],
        rows.map((p) => {
          const totalPaid = paid.get(p.id) ?? 0;
          return [
            names.get(p.garden_id) ?? p.garden_id,
            p.ref,
            p.status,
            p.reservation_holder,
            p.purchaser_name,
            p.purchaser_phone,
            p.purchaser_email,
            Number(p.price ?? 0),
            totalPaid,
            Math.round((Number(p.price ?? 0) - totalPaid) * 100) / 100,
          ];
        })
      );
      return { filename: `reservations-${date}.csv`, csv };
    }
  }
}
