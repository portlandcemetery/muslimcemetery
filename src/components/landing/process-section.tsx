import { Card } from "@/components/ui/card";
import { Diamond } from "@/components/diamond";

const STEPS = [
  {
    title: "Contact us",
    body: "Call Ali Houdroge at 503-646-5799 (in an emergency, 503-998-2498). We will guide you through every step and coordinate the burial with you.",
  },
  {
    title: "Arrange a funeral home",
    body: "Choose a funeral home to recover and transport the body — we recommend Crown Memorial Funeral Homes in Tualatin. Payment for funeral-home services is the family's responsibility.",
  },
  {
    title: "Washing & shrouding",
    body: "MCOP volunteers perform ghusl (washing) and kafan (shrouding) according to Islamic tradition, at no charge. The shroud cloth is provided by MCOP.",
  },
  {
    title: "Janazah prayer",
    body: "Salatul Janazah is held at the MCOP. If the body arrives before Zuhr, the funeral prayer follows so that burial may take place before Maghrib.",
  },
  {
    title: "Burial",
    body: "The gravesite is assigned on a first-come, first-served basis. Grave digging is coordinated by MCOP with an outside company; this service is paid by the family.",
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="scroll-mt-[100px] bg-background">
      <div className="max-w-[900px] mx-auto py-[88px] px-9">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-[14px] mb-[14px]">
            <span className="w-10 h-px bg-accent/50" />
            <Diamond size={16} className="text-accent" />
            <span className="w-10 h-px bg-accent/50" />
          </div>
          <h2 className="font-extrabold text-[40px] tracking-[-0.02em] mb-[14px]">
            When a death occurs
          </h2>
          <p className="text-[17px] text-muted-foreground leading-[1.7] max-w-[58ch] mx-auto">
            A simple, dignified process — we walk with you at every stage,
            insha&apos;Allah.
          </p>
        </div>

        <ol className="relative flex flex-col gap-0 before:absolute before:left-[19px] before:top-3 before:bottom-3 before:w-px before:bg-border">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative flex gap-5 pb-8 last:pb-0">
              <span className="relative z-[1] flex-none w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-[16px] flex items-center justify-center shadow-[0_6px_16px_-8px_rgba(31,91,69,.7)]">
                {i + 1}
              </span>
              <div className="pt-[6px]">
                <h3 className="font-bold text-[18px] tracking-[-0.01em] mb-1">
                  {s.title}
                </h3>
                <p className="text-[15.5px] leading-[1.65] text-foreground/75">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <Card className="mt-10 border-border rounded-[18px] py-6 px-7 gap-0 bg-secondary/50">
          <div className="text-[12.5px] font-bold tracking-[0.1em] uppercase text-primary mb-3">
            The funeral home handles
          </div>
          <p className="text-[15px] text-card-foreground leading-[1.65]">
            Picking up the body from the hospital, providing a facility to prepare
            the body, obtaining the death certificate and burial permit, and
            transferring the body to the MCOP cemetery.
          </p>
        </Card>
      </div>
    </section>
  );
}
