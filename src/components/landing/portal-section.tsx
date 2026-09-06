import { PortalSignIn } from "./portal-sign-in";

export function PortalSection() {
  return (
    <section
      id="portal"
      className="scroll-mt-[90px] relative overflow-hidden bg-secondary"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-60 bg-[url(/assets/pattern-gold.svg)] bg-repeat bg-[length:128px]"
      />
      <div className="relative z-[1] max-w-[1120px] mx-auto py-[88px] px-9 grid justify-items-center">
        <div className="text-center max-w-[520px] mb-[34px]">
          <div className="text-[12.5px] font-bold tracking-[0.16em] uppercase text-accent mb-[14px]">
            Management Portal
          </div>
          <h2 className="font-extrabold text-[38px] tracking-[-0.02em] mb-[14px]">
            Sign in to continue
          </h2>
          <p className="text-[16.5px] text-foreground/75 leading-[1.6]">
            For authorized operators and administration.
          </p>
        </div>

        <PortalSignIn />
      </div>
    </section>
  );
}
