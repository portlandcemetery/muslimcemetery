import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "./section-heading";

export function PlotNotes() {
  return (
    <>
      <div className="mt-[30px]">
        <SectionHeading title="Notes & Comments" small />
      </div>
      <Textarea
        rows={4}
        defaultValue="Plot reserved by grandson Tariq. Second installment scheduled for January 2026. Sunnah-compliant standard flat granite headstone ordered."
        className="w-full py-[14px] px-[15px] text-[14.5px] leading-[1.6] text-card-foreground bg-white/50 border-input rounded-xl resize-y"
      />
    </>
  );
}
