import { Diamond } from "@/components/diamond";

export function MissionSection() {
  return (
    <section
      id="mission"
      className="scroll-mt-[100px] relative overflow-hidden bg-primary text-primary-foreground"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-90 bg-[url(/assets/pattern-gold-light.svg)] bg-repeat bg-[length:128px]"
      />
      <div className="relative z-[1] max-w-[820px] mx-auto py-[88px] px-9 text-center">
        <div className="flex items-center justify-center gap-[14px] mb-[26px]">
          <span className="w-11 h-px bg-primary-foreground/40" />
          <span className="text-[12.5px] font-bold tracking-[0.18em] uppercase text-accent">
            Our sacred mission
          </span>
          <span className="w-11 h-px bg-primary-foreground/40" />
        </div>
        <p className="text-[24px] md:text-[26px] leading-[1.55] tracking-[-0.01em] text-primary-foreground font-medium">
          In creating a place of permanent rest dedicated exclusively for
          Muslims, we sustain the identity of our community across the Portland
          metropolitan area and southwest Washington. Preparing a dignified final
          resting place is a collective obligation —{" "}
          <span className="text-accent">Fard Kifayah</span> — upon us all.
        </p>
        <Diamond size={22} strokeWidth={1.4} className="text-accent mx-auto mt-[34px]" />
      </div>
    </section>
  );
}
