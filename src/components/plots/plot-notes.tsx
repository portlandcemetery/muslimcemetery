import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "./section-heading";

export function PlotNotes({
  defaultValue,
  readOnly,
}: {
  defaultValue: string;
  readOnly: boolean;
}) {
  return (
    <>
      <div className="mt-[30px]">
        <SectionHeading title="Notes & Comments" small />
      </div>
      <Textarea
        rows={4}
        name="notes"
        defaultValue={defaultValue}
        readOnly={readOnly}
        className="w-full py-[14px] px-[15px] text-[14.5px] leading-[1.6] text-card-foreground bg-white/50 border-input rounded-xl resize-y read-only:opacity-70"
      />
    </>
  );
}
