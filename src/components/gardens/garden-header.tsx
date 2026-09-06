"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEGEND, type GardenInfo } from "./garden-data";

export function GardenHeader({
  garden,
  gardens,
  onGardenChange,
  showMine = false,
}: {
  garden: GardenInfo;
  gardens: GardenInfo[];
  onGardenChange: (id: string) => void;
  showMine?: boolean;
}) {
  return (
    <div className="flex-none px-5 sm:px-8 lg:px-10 pt-5 sm:pt-7 pb-5 border-b border-border">
      <div className="text-sm text-muted-foreground/90 mb-2">
        <Link href="/dashboard" className="hover:text-primary">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <Link href="/gardens" className="hover:text-primary">
          Gardens
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-semibold">{garden.name}</span>
      </div>
      <div className="flex items-end justify-between gap-x-6 gap-y-4 flex-wrap">
        <div className="flex flex-wrap items-center gap-x-[14px] gap-y-2">
          <div className="flex flex-wrap items-baseline gap-x-[14px]">
            <h1 className="font-extrabold text-[26px] sm:text-[34px] tracking-[-0.02em]">
              {garden.name}
            </h1>
            <span className="font-arabic text-[24px] sm:text-[30px] text-primary">
              {garden.arabic}
            </span>
          </div>
          <Select
            items={gardens.map((g) => ({ value: g.id, label: g.name }))}
            value={garden.id}
            onValueChange={(v) => v && onGardenChange(v)}
          >
            <SelectTrigger
              aria-label="Change garden"
              className="data-[size=default]:h-[50px] px-4 rounded-[11px] bg-card border-input text-[14.5px] font-semibold text-card-foreground"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {gardens.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          {showMine && (
            <span className="flex items-center gap-2 text-[13.5px] text-primary font-semibold">
              <span className="w-[11px] h-[11px] rounded-[3px] bg-primary/20 ring-1 ring-primary/60" />
              Your Plot
            </span>
          )}
        </Card>
      </div>
    </div>
  );
}
