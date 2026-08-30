"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  STATUS_META,
  STATUS_ORDER,
  type PlotDetailStatus,
} from "./plot-status-data";

export function PlotStatusSelect({
  value,
  onChange,
}: {
  value: PlotDetailStatus;
  onChange: (status: PlotDetailStatus) => void;
}) {
  return (
    <div className="mb-[22px]">
      <Label className="text-[13.5px] font-semibold text-foreground/85 mb-2">
        Plot Status
      </Label>
      <Select
        items={STATUS_ORDER.map((s) => ({ value: s, label: STATUS_META[s].option }))}
        value={value}
        onValueChange={(v) => onChange(v as PlotDetailStatus)}
      >
        <SelectTrigger className="w-full data-[size=default]:h-[50px] px-[15px] rounded-xl border-[1.5px] border-primary bg-primary/5 text-[15.5px] font-semibold text-primary [&_svg]:text-primary">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_ORDER.map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_META[s].option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
