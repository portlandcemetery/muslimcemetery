import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Diamond } from "@/components/diamond";

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
          <span className="w-10 h-px bg-accent/50" />
          <Diamond size={18} className="text-accent" />
          <span className="w-10 h-px bg-accent/50" />
        </div>
        <p className="text-base text-muted-foreground tracking-[0.01em] mb-11">
          “Indeed, to Allah we belong, and to Him we shall return.”{" "}
          <span className="text-muted-foreground/80">— Al-Baqarah 2:156</span>
        </p>

        <h1 className="font-extrabold text-[44px] md:text-[64px] leading-[1.05] tracking-[-0.03em] mb-6">
          Muslim Cemetery
          <br />
          of Portland
        </h1>
        <p className="text-[19px] leading-[1.65] text-foreground/75 max-w-[58ch] mx-auto mb-10">
          Portland&apos;s only all-Muslim cemetery — a dignified, 100%
          Sunnah-compliant resting place dedicated exclusively to Muslims, and
          affordable to Sunni and Shia families alike.
        </p>
      </div>

      {/* arch niche photo */}
      <div className="relative z-[1] max-w-[560px] mx-auto px-9 pb-5">
        <div className="h-[420px] border border-border rounded-[50%_50%_14px_14px/40%_40%_14px_14px] overflow-hidden shadow-[0_30px_60px_-40px_rgba(31,91,69,.4)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/cemetery-1.webp"
            alt="Muslim Cemetery of Portland grounds"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="relative z-[1] flex flex-wrap items-center justify-center gap-3 pt-2 px-9 pb-[72px]">
        <a
          href="#contact"
          className={cn(
            buttonVariants(),
            "h-auto py-[15px] px-[34px] text-base font-semibold rounded-full",
          )}
        >
          Contact us
        </a>
        <a
          href="#portal"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-auto py-[15px] px-[34px] text-base font-semibold rounded-full bg-card",
          )}
        >
          Sign in to the portal
        </a>
      </div>
    </section>
  );
}
