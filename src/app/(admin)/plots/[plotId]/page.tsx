import { ComingSoon } from "@/components/dashboard/coming-soon";

export default async function PlotDetailPage({
  params,
}: {
  params: Promise<{ plotId: string }>;
}) {
  const { plotId } = await params;
  return <ComingSoon title={`Plot ${plotId.toUpperCase()}`} />;
}
