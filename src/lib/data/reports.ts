import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getGardenCounts, sumStats } from "@/lib/data/dashboard";
import { toCsv, type CsvValue } from "@/lib/csv";
import type { PlotStatus } from "@/lib/types";

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

const RESERVED: PlotStatus[] = ["full", "partial", "unpaid"];

const PAGE_SIZE = 1000;

type PageResult<T> = { data: T[] | null; error: { message: string } | null };

async function fetchAll<T>(
  page: (from: number, to: number) => PromiseLike<PageResult<T>>
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await page(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) break;
  }
  return rows;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function getReportStats(): Promise<ReportStats> {
  const supabase = await createClient();
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const nextMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  const yearStart = `${now.getUTCFullYear()}-01-01`;

  const [gardens, burialsMonth, reservedPlots, paidByPlot, payments] =
    await Promise.all([
      getGardenCounts(),
      supabase
        .from("plots")
        .select("id", { count: "exact", head: true })
        .gte("burial_date", isoDate(monthStart))
        .lt("burial_date", isoDate(nextMonthStart)),
      fetchAll<{ id: string; price: number }>((from, to) =>
        supabase.from("plots").select("id, price").in("status", RESERVED).range(from, to)
      ),
      fetchPaidByPlot(),
      fetchAll<{ amount: number }>((from, to) =>
        supabase
          .from("payments")
          .select("amount")
          .gte("paid_at", yearStart)
          .range(from, to)
      ),
    ]);

  if (burialsMonth.error) throw new Error(burialsMonth.error.message);

  const stats = sumStats(gardens);
  const pendingPayment = reservedPlots.filter(
    (p) => Number(p.price ?? 0) - (paidByPlot.get(p.id) ?? 0) > 0
  ).length;
  const paymentsYtd = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  return {
    totalPlots: stats.total,
    totalBurials: stats.occupied,
    burialsThisMonth: burialsMonth.count ?? 0,
    activeReservations: stats.reserved,
    pendingPayment,
    paymentsYtd,
    occupancyRate: stats.total > 0 ? stats.occupied / stats.total : 0,
  };
}

// Total paid per plot, summed from the payments ledger (source of truth —
// outstanding is always derived as price − paid at the call site)
async function fetchPaidByPlot(): Promise<Map<string, number>> {
  const supabase = await createClient();
  const rows = await fetchAll<{ plot_id: string; amount: number }>((from, to) =>
    supabase.from("payments").select("plot_id, amount").range(from, to)
  );
  const paid = new Map<string, number>();
  for (const r of rows) {
    paid.set(r.plot_id, (paid.get(r.plot_id) ?? 0) + Number(r.amount));
  }
  return paid;
}

async function fetchGardenNames(): Promise<Map<string, string>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("gardens").select("id, name");
  if (error) throw new Error(error.message);
  return new Map((data ?? []).map((g) => [g.id, g.name]));
}

export async function buildReportCsv(
  type: ReportType
): Promise<{ filename: string; csv: string }> {
  const date = isoDate(new Date());
  switch (type) {
    case "occupancy": {
      const gardens = await getGardenCounts();
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
        gardens.map((g) => [
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
      const supabase = await createClient();
      const [plots, paidByPlot, gardenNames] = await Promise.all([
        fetchAll<{
          id: string;
          garden_id: string;
          ref: string;
          status: PlotStatus;
          purchaser_name: string | null;
          reservation_holder: string | null;
          price: number;
        }>((from, to) =>
          supabase
            .from("plots")
            .select("id, garden_id, ref, status, purchaser_name, reservation_holder, price")
            .order("garden_id")
            .order("ref")
            .range(from, to)
        ),
        fetchPaidByPlot(),
        fetchGardenNames(),
      ]);
      const rows: CsvValue[][] = [];
      for (const p of plots) {
        const totalPaid = paidByPlot.get(p.id) ?? 0;
        const active = p.status !== "available" && p.status !== "unavailable";
        if (!active && totalPaid <= 0) continue;
        rows.push([
          gardenNames.get(p.garden_id) ?? p.garden_id,
          p.ref,
          p.status,
          p.purchaser_name,
          p.reservation_holder,
          Number(p.price ?? 0),
          totalPaid,
          Number(p.price ?? 0) - totalPaid,
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
        rows
      );
      return { filename: `financial-payments-${date}.csv`, csv };
    }
    case "burials": {
      const supabase = await createClient();
      const [plots, gardenNames] = await Promise.all([
        fetchAll<{
          garden_id: string;
          ref: string;
          deceased_name: string | null;
          date_of_birth: string | null;
          date_of_death: string | null;
          burial_date: string | null;
          id_tag_number: string | null;
          case_number: string | null;
          county_of_death: string | null;
        }>((from, to) =>
          supabase
            .from("plots")
            .select(
              "garden_id, ref, deceased_name, date_of_birth, date_of_death, burial_date, id_tag_number, case_number, county_of_death"
            )
            .eq("status", "buried")
            .order("burial_date", { ascending: true, nullsFirst: false })
            .order("ref")
            .range(from, to)
        ),
        fetchGardenNames(),
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
        plots.map((p) => [
          gardenNames.get(p.garden_id) ?? p.garden_id,
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
      const supabase = await createClient();
      const [plots, paidByPlot, gardenNames] = await Promise.all([
        fetchAll<{
          id: string;
          garden_id: string;
          ref: string;
          status: PlotStatus;
          reservation_holder: string | null;
          purchaser_name: string | null;
          purchaser_phone: string | null;
          purchaser_email: string | null;
          price: number;
        }>((from, to) =>
          supabase
            .from("plots")
            .select(
              "id, garden_id, ref, status, reservation_holder, purchaser_name, purchaser_phone, purchaser_email, price"
            )
            .in("status", RESERVED)
            .order("status")
            .order("garden_id")
            .order("ref")
            .range(from, to)
        ),
        fetchPaidByPlot(),
        fetchGardenNames(),
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
        plots.map((p) => {
          const totalPaid = paidByPlot.get(p.id) ?? 0;
          return [
            gardenNames.get(p.garden_id) ?? p.garden_id,
            p.ref,
            p.status,
            p.reservation_holder,
            p.purchaser_name,
            p.purchaser_phone,
            p.purchaser_email,
            Number(p.price ?? 0),
            totalPaid,
            Number(p.price ?? 0) - totalPaid,
          ];
        })
      );
      return { filename: `reservations-${date}.csv`, csv };
    }
  }
}
