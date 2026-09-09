import { Card } from "@/components/ui/card";
import { Diamond } from "@/components/diamond";

const RULES = [
  "Every grave must be identified by a grave stone, installed flush with the cemetery ground — not at grass level.",
  "Grave markers follow a standard size; permitted information is limited to the name and the dates of birth and death.",
  "Planting flowers or plants on a grave is not allowed; only potted plants in containers may be placed.",
  "Burial follows a first-come, first-served master plan — gravesites are assigned by the cemetery.",
  "Women are welcome to attend the funeral service.",
  "The full Cemetery Rules & Regulations booklet is available from the office on request.",
];

export function RulesSection() {
  return (
    <section
      id="rules"
      className="scroll-mt-[100px] relative overflow-hidden bg-background"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-50 bg-[url(/assets/pattern-gold.svg)] bg-repeat bg-[length:128px]"
      />
      <div className="relative z-[1] max-w-[1000px] mx-auto py-[88px] px-9">
        <div className="text-center mb-12">
          <h2 className="font-extrabold text-[40px] tracking-[-0.02em] mb-[14px]">
            Cemetery rules &amp; guidelines
          </h2>
          <p className="text-[17px] text-muted-foreground leading-[1.7] max-w-[60ch] mx-auto">
            To preserve the sacred serenity and Sunnah of our gardens, all
            visitors are kindly asked to observe the following.
          </p>
        </div>
        <Card className="border-border rounded-[20px] py-[14px] px-10 gap-0 shadow-[0_24px_60px_-44px_rgba(34,39,31,.5)]">
          {RULES.map((text, i) => (
            <div
              key={i}
              className="flex gap-5 items-center py-[22px] border-b border-border last:border-b-0"
            >
              <Diamond size={26} variant="fill" className="text-accent flex-none" />
              <p className="text-[17px] text-card-foreground leading-[1.55]">
                {text}
              </p>
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
}
