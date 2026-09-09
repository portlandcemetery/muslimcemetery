"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PlotDetailForm } from "@/components/plots/plot-detail-form";
import { PageLoader } from "@/components/page-loader";
import { useTRPC } from "@/services/trpc/client";
import { isStaff } from "@/lib/types";

function parseSlug(slug: string): { gardenId: string; ref: string } | null {
  const decoded = (() => {
    try {
      return decodeURIComponent(slug);
    } catch {
      return slug;
    }
  })();
  const match = /^([A-Za-z])-([A-Ha-h][A-Fa-f][1-4])$/.exec(decoded);
  if (!match) return null;
  return { gardenId: match[1].toLowerCase(), ref: match[2].toUpperCase() };
}

export default function PlotDetailPage() {
  const trpc = useTRPC();
  const params = useParams<{ plotId: string }>();
  const parsed = parseSlug(params.plotId ?? "");

  const me = useQuery(trpc.auth.me.queryOptions());
  const gardens = useQuery(trpc.gardens.list.queryOptions());
  const plot = useQuery(
    trpc.plots.getBySlug.queryOptions(
      { gardenId: parsed?.gardenId ?? "", ref: parsed?.ref ?? "" },
      { enabled: !!parsed && !!me.data }
    )
  );
  const payments = useQuery(
    trpc.payments.listByPlot.queryOptions(
      { gardenId: parsed?.gardenId ?? "", ref: parsed?.ref ?? "" },
      { enabled: !!parsed && !!plot.data }
    )
  );
  const documents = useQuery(
    trpc.documents.listByPlot.queryOptions(
      { gardenId: parsed?.gardenId ?? "", ref: parsed?.ref ?? "" },
      { enabled: !!parsed && !!plot.data }
    )
  );

  if (!parsed) {
    return (
      <div className="flex min-h-full items-center justify-center px-5 text-muted-foreground">
        Plot not found.
      </div>
    );
  }

  const garden = gardens.data?.find((g) => g.id === parsed.gardenId);

  if (!me.data || plot.isLoading || gardens.isLoading) {
    return <PageLoader />;
  }

  if (!garden) {
    return (
      <div className="flex min-h-full items-center justify-center px-5 text-muted-foreground">
        Garden not found.
      </div>
    );
  }

  // Restricted: viewer without access (server returns null).
  if (!plot.data) {
    if (isStaff(me.data.role)) {
      return (
        <div className="flex min-h-full items-center justify-center px-5 text-muted-foreground">
          Plot not found.
        </div>
      );
    }
    return (
      <div className="flex min-h-full items-center justify-center px-5">
        <div className="max-w-[420px] text-center bg-card border border-border rounded-[20px] p-9">
          <div className="font-bold text-[18px] mb-2">Restricted plot</div>
          <p className="text-[14.5px] text-muted-foreground mb-5">
            Plot {parsed.ref} in {garden.name} isn&apos;t linked to your account.
            Contact the office if you believe this is a mistake.
          </p>
          <Link href="/gardens" className="text-primary font-semibold text-[14.5px]">
            ← Back to the garden map
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PlotDetailForm
      plot={plot.data}
      gardenName={garden.name}
      gardenArabic={garden.arabic}
      payments={payments.data ?? []}
      documents={documents.data ?? []}
      role={me.data.role}
    />
  );
}
