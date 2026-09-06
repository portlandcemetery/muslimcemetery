import Link from "next/link";
import { STATUS_META, type PlotStatus } from "./plot-status-data";

export function PlotHeader({
  plotRef,
  gardenId,
  gardenName,
  gardenArabic,
  status,
}: {
  plotRef: string;
  gardenId: string;
  gardenName: string;
  gardenArabic: string;
  status: PlotStatus;
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
        <Link href={`/gardens?garden=${gardenId}`} className="hover:text-primary">
          {gardenName}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-semibold">Plot {plotRef}</span>
      </div>
      <div className="flex items-center gap-[18px] flex-wrap mb-[26px]">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <h1 className="font-extrabold text-[24px] sm:text-[32px] tracking-[-0.02em]">
            Plot {plotRef} · {gardenName}
          </h1>
          <span className="font-arabic text-[22px] sm:text-[26px] text-primary">
            {gardenArabic}
          </span>
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
