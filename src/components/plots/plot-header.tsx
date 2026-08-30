import Link from "next/link";
import { STATUS_META, type PlotDetailStatus } from "./plot-status-data";

export function PlotHeader({
  plotId,
  status,
}: {
  plotId: string;
  status: PlotDetailStatus;
}) {
  const meta = STATUS_META[status];
  return (
    <>
      <div className="text-sm text-muted-foreground/90 mb-[10px]">
        <Link href="/dashboard" className="hover:text-primary">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <Link href="/gardens" className="hover:text-primary">
          Gardens
        </Link>
        <span className="mx-2">/</span>
        <Link href="/gardens" className="hover:text-primary">
          Garden A
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-semibold">Plot {plotId}</span>
      </div>
      <div className="flex items-center gap-[18px] flex-wrap mb-[26px]">
        <div className="flex items-baseline gap-3">
          <h1 className="font-extrabold text-[32px] tracking-[-0.02em]">
            Plot {plotId} · Garden A – Al-Firdaus
          </h1>
          <span className="font-arabic text-[26px] text-primary">الفردوس</span>
        </div>
        <span
          className={`inline-flex items-center gap-2 py-2 px-4 rounded-full text-sm font-bold border ${meta.badgeClass}`}
        >
          <span className="w-[9px] h-[9px] rounded-full bg-current" />
          {meta.badge}
        </span>
      </div>
    </>
  );
}
