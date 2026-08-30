import { Card } from "@/components/ui/card";
import { Diamond } from "@/components/diamond";

const RULES = [
  "Visiting hours are strictly from dawn to dusk daily.",
  "Only live plants or fresh-cut flowers are permitted; no artificial flowers.",
  "In accordance with Sunnah, all headstones must face the Qibla.",
  "Modest dress is required at all times while on cemetery grounds.",
  "Children under 12 must be supervised by an adult at all times.",
  "No pets are allowed inside the memorial gardens.",
  "Please maintain silence and respect the dignity of the space.",
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
