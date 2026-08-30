import { PlotDetailForm } from "@/components/plots/plot-detail-form";

export default async function PlotDetailPage({
  params,
}: {
  params: Promise<{ plotId: string }>;
}) {
  const { plotId } = await params;
  return <PlotDetailForm plotId={plotId.toUpperCase()} />;
}
