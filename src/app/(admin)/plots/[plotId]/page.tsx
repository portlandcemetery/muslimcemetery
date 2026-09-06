import { notFound } from "next/navigation";
import Link from "next/link";
import { PlotDetailForm } from "@/components/plots/plot-detail-form";
import { requireProfile } from "@/lib/data/auth";
import { getGardens } from "@/lib/data/gardens";
import { getDocuments, getPayments, getPlot } from "@/lib/data/plots";
import { isStaff } from "@/lib/types";

// URL shape: /plots/{gardenId}-{ref}, e.g. /plots/a-AA1 (refs repeat across gardens)
function parseSlug(slug: string): { gardenId: string; ref: string } | null {
  const match = /^([a-z])-([A-Ha-h][A-Fa-f][1-4])$/.exec(slug);
  if (!match) return null;
  return { gardenId: match[1], ref: match[2].toUpperCase() };
}

export default async function PlotDetailPage({
  params,
}: {
  params: Promise<{ plotId: string }>;
}) {
  const { plotId } = await params;
  const parsed = parseSlug(decodeURIComponent(plotId));
  if (!parsed) notFound();

  const [profile, gardens, plot] = await Promise.all([
    requireProfile(),
    getGardens(),
    getPlot(parsed.gardenId, parsed.ref),
  ]);

  const garden = gardens.find((g) => g.id === parsed.gardenId);
  if (!garden) notFound();

  // Non-staff only get rows for plots mapped to them (RLS) — anything else is restricted
  if (!plot) {
    if (isStaff(profile.role)) notFound();
    return (
      <div className="flex min-h-full items-center justify-center px-5">
        <div className="max-w-[420px] text-center bg-card border border-border rounded-[20px] p-9">
          <div className="font-bold text-[18px] mb-2">Restricted plot</div>
          <p className="text-[14.5px] text-muted-foreground mb-5">
            Plot {parsed.ref} in {garden.name} isn&apos;t linked to your
            account. Contact the office if you believe this is a mistake.
          </p>
          <Link href="/gardens" className="text-primary font-semibold text-[14.5px]">
            ← Back to the garden map
          </Link>
        </div>
      </div>
    );
  }

  const [payments, documents] = await Promise.all([
    getPayments(plot.id),
    getDocuments(plot.id),
  ]);

  return (
    <PlotDetailForm
      plot={plot}
      gardenName={garden.name}
      gardenArabic={garden.arabic}
      payments={payments}
      documents={documents}
      role={profile.role}
    />
  );
}
