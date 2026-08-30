import Link from "next/link";
import { Card } from "@/components/ui/card";
import { LEGEND } from "./garden-data";

export function GardenHeader() {
  return (
    <div className="flex-none px-10 pt-7 pb-5 border-b border-border">
      <div className="text-sm text-muted-foreground/90 mb-2">
        <Link href="/dashboard" className="hover:text-primary">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <Link href="/gardens" className="hover:text-primary">
          Gardens
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-semibold">
          Garden A – Al-Firdaus
        </span>
      </div>
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div className="flex items-baseline gap-[14px]">
          <h1 className="font-extrabold text-[34px] tracking-[-0.02em]">
            Garden A – Al-Firdaus
          </h1>
          <span className="font-arabic text-[30px] text-primary">الفردوس</span>
        </div>
        <Card className="flex-row flex-wrap items-center gap-x-[22px] gap-y-4 border-border rounded-[14px] py-[11px] px-[18px]">
          {LEGEND.map((l) => (
            <span
              key={l.name}
              className="flex items-center gap-2 text-[13.5px] text-foreground/85 font-medium"
            >
              <span className={`w-[11px] h-[11px] rounded-full ${l.dot}`} />
              {l.name}
            </span>
          ))}
        </Card>
      </div>
    </div>
  );
}
