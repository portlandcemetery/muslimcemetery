import { Card } from "@/components/ui/card";
import { Diamond } from "@/components/diamond";

type Fee = { label: string; price: string; note?: string; free?: boolean };

const FEES: Fee[] = [
  { label: "Adult plot", price: "$2,500" },
  { label: "Child plot (3–12 years)", price: "$1,000" },
  {
    label: "Infant under 3, premature & miscarriage",
    price: "Free",
    free: true,
  },
  { label: "Fiber vault", price: "$500" },
  { label: "Open / close of grave — weekday", price: "$800" },
  { label: "Open / close of grave — Saturday", price: "$1,250" },
  { label: "Open / close of grave — Sunday", price: "$1,550" },
];

const INCLUDED = [
  "Ghusl & kafan — washing and shrouding per Islamic tradition",
  "Janazah prayer and Talqeen before burial",
  "Kafan (shroud cloth) provided by MCOP",
];

const NOT_INCLUDED = [
  "Memorial grave stone (required; must sit flush with the ground)",
  "Flowers or plants (only potted plants in containers are allowed)",
  "Any reception or meal",
  "3rd, 7th, 40th and annual memorial ceremonies",
];

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-[100px] bg-secondary/60 border-y border-border">
      <div className="max-w-[1120px] mx-auto py-[88px] px-9">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-[14px] mb-[14px]">
            <span className="w-10 h-px bg-accent/50" />
            <Diamond size={16} className="text-accent" />
            <span className="w-10 h-px bg-accent/50" />
          </div>
          <h2 className="font-extrabold text-[40px] tracking-[-0.02em] mb-[14px]">
            Pricing &amp; fees
          </h2>
          <p className="text-[17px] text-muted-foreground leading-[1.7] max-w-[60ch] mx-auto">
            Transparent, community pricing so every family can give their loved
            ones a proper Islamic burial.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
          <Card className="border-border rounded-[20px] py-[14px] px-8 gap-0 shadow-[0_24px_60px_-46px_rgba(34,39,31,.5)]">
            {FEES.map((f) => (
              <div
                key={f.label}
                className="flex items-center justify-between gap-5 py-[18px] border-b border-border last:border-b-0"
              >
                <span className="text-[16px] text-card-foreground leading-[1.4]">
                  {f.label}
                </span>
                <span
                  className={`flex-none font-extrabold text-[18px] ${f.free ? "text-accent" : "text-primary"}`}
                >
                  {f.price}
                </span>
              </div>
            ))}
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="border-border rounded-[20px] py-7 px-7 gap-0">
              <div className="text-[12.5px] font-bold tracking-[0.1em] uppercase text-primary mb-4">
                Included at no charge
              </div>
              <ul className="flex flex-col gap-3">
                {INCLUDED.map((t) => (
                  <li key={t} className="flex gap-3 items-start">
                    <Diamond size={16} variant="fill" className="text-accent flex-none mt-[3px]" />
                    <span className="text-[15px] text-card-foreground leading-[1.5]">{t}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="border-border rounded-[20px] py-7 px-7 gap-0 bg-secondary/50">
              <div className="text-[12.5px] font-bold tracking-[0.1em] uppercase text-muted-foreground/85 mb-4">
                Not included
              </div>
              <ul className="flex flex-col gap-[10px]">
                {NOT_INCLUDED.map((t) => (
                  <li key={t} className="text-[14.5px] text-muted-foreground leading-[1.5] pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-[6px] before:h-[6px] before:rounded-full before:bg-muted-foreground/40">
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        <div className="mt-8 rounded-[16px] border border-primary/25 bg-primary/[0.06] py-5 px-7 text-center">
          <p className="text-[15.5px] text-foreground/85 leading-[1.6]">
            The MCOP does not accept credit cards — payment is by{" "}
            <span className="font-semibold text-primary">check, cash, or Zelle</span>,
            collected by cemetery staff prior to burial. Additional cost may apply
            for burial services on weekends and holidays.
          </p>
        </div>
      </div>
    </section>
  );
}
