import { and, eq } from "drizzle-orm";

import { db } from "@/services/db/index";
import { activityLog, plots } from "@/services/db/schema";
import { COLS, ROW_LETTERS } from "@/components/gardens/garden-data";

// db instance OR a transaction handle — both share the query-builder surface.
export type Db =
  | typeof db
  | Parameters<Parameters<(typeof db)["transaction"]>[0]>[0];

// Full static grid size per garden: cols × rows × 4 positions per cell.
export const GRID_SIZE = COLS.length * ROW_LETTERS.length * 4;

const REF_RE = /^([A-H])([A-F])([1-4])$/;

// Parse "a-AA1" → { gardenId: "a", ref: "AA1" }. Garden ids are single letters.
export function parseSlug(
  slug: string
): { gardenId: string; ref: string } | null {
  const i = slug.indexOf("-");
  if (i <= 0) return null;
  const gardenId = slug.slice(0, i);
  const ref = slug.slice(i + 1).toUpperCase();
  if (!/^[a-z]$/.test(gardenId) || !REF_RE.test(ref)) return null;
  return { gardenId, ref };
}

// Create the plot row on demand (sparse model) and return its id.
export async function ensurePlot(
  tx: Db,
  gardenId: string,
  ref: string
): Promise<string> {
  const m = REF_RE.exec(ref);
  if (!m) throw new Error(`Invalid plot ref: ${ref}`);
  const [, col, row, pos] = m;

  const inserted = await tx
    .insert(plots)
    .values({
      garden_id: gardenId,
      ref,
      col_letter: col,
      row_letter: row,
      position: Number(pos),
    })
    .onConflictDoNothing({ target: [plots.garden_id, plots.ref] })
    .returning({ id: plots.id });
  if (inserted[0]) return inserted[0].id;

  const [existing] = await tx
    .select({ id: plots.id })
    .from(plots)
    .where(and(eq(plots.garden_id, gardenId), eq(plots.ref, ref)))
    .limit(1);
  return existing.id;
}

export async function insertActivity(
  tx: Db,
  entry: {
    actorName: string | null;
    action: string;
    entity: string;
    plotRef?: string | null;
  }
) {
  await tx.insert(activityLog).values({
    actor_name: entry.actorName,
    action: entry.action,
    entity: entry.entity,
    plot_ref: entry.plotRef ?? null,
  });
}
