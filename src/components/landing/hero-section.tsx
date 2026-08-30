import { Diamond } from "./diamond";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-[url(/assets/pattern-gold.svg)] bg-repeat bg-[length:128px] [mask-image:linear-gradient(180deg,rgba(0,0,0,.85),rgba(0,0,0,.25)_60%,transparent)] [-webkit-mask-image:linear-gradient(180deg,rgba(0,0,0,.85),rgba(0,0,0,.25)_60%,transparent)]"
      />

      <div className="relative z-[1] max-w-[880px] mx-auto pt-20 px-9 pb-[30px] text-center">
        <div
          dir="rtl"
          className="font-arabic text-[44px] leading-[1.7] text-primary mb-4"
        >
          إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ
        </div>
        <div className="flex items-center justify-center gap-[14px] mb-3">
          <span className="w-10 h-px bg-gold-soft" />
          <Diamond size={18} stroke="var(--color-gold)" />
          <span className="w-10 h-px bg-gold-soft" />
        </div>
        <p className="text-base text-muted-foreground tracking-[0.01em] mb-11">
          “Indeed, to Allah we belong, and to Him we shall return.”{" "}
          <span className="text-taupe-muted">— Al-Baqarah 2:156</span>
        </p>

        <h1 className="font-extrabold text-[44px] md:text-[66px] leading-[1.05] tracking-[-0.03em] mb-6">
          Honoring those who
          <br />
          have returned to Allah
        </h1>
        <p className="text-[19px] leading-[1.65] text-slate-light max-w-[56ch] mx-auto mb-10">
          The Memorial Gardens of the Islamic Center of Portland provide a
          dignified, Sunnah-compliant final resting place — tended with prayer,
          transparency, and lasting care for every family we serve.
        </p>
      </div>

      {/* arch niche image */}
      <div className="relative z-[1] max-w-[560px] mx-auto px-9 pb-5">
        <div
          aria-hidden="true"
          className="h-[420px] border border-border rounded-[50%_50%_14px_14px/40%_40%_14px_14px] overflow-hidden bg-[repeating-linear-gradient(135deg,#ece4d1_0_15px,#f3ecdd_15px_30px)] flex items-end justify-center p-5 shadow-[0_30px_60px_-40px_rgba(31,91,69,.4)]"
        >
          <span className="font-mono text-[12.5px] text-taupe-light bg-white/90 py-[7px] px-[13px] rounded-lg border border-border">
            photo — the gardens (arch niche)
          </span>
        </div>
      </div>

      <div className="relative z-[1] text-center pt-2 px-9 pb-[72px]">
        <a
          href="#portal"
          className="inline-block py-[15px] px-[34px] bg-primary text-primary-foreground text-base font-semibold rounded-full transition-colors hover:bg-primary-hover"
        >
          Sign in to the portal
        </a>
      </div>
    </section>
  );
}
