import type { ReactNode } from "react";

type ContactCard = {
  label: string;
  icon: ReactNode;
  body: ReactNode;
};

const CARDS: ContactCard[] = [
  {
    label: "Visit",
    icon: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    body: (
      <>
        1010 SW Naito Parkway
        <br />
        Portland, OR 97204
      </>
    ),
  },
  {
    label: "Call",
    icon: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    ),
    body: (
      <>
        +1 (503) 555-0142
        <br />
        Mon–Fri, 9am–5pm
      </>
    ),
  },
  {
    label: "Email",
    icon: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 6L2 7" />
      </>
    ),
    body: <>gardens@icportland.org</>,
  },
];

export function ContactSection() {
  return (
    <section
      id="contact"
      className="scroll-mt-[100px] bg-background border-t border-border"
    >
      <div className="max-w-[1120px] mx-auto py-[82px] px-9">
        <h2 className="font-extrabold text-[34px] tracking-[-0.02em] mb-[34px] text-center">
          Address &amp; contact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CARDS.map((c) => (
            <div
              key={c.label}
              className="bg-card border border-card-border rounded-2xl py-[30px] px-7 text-center"
            >
              <div className="w-[46px] h-[46px] rounded-[50%_50%_10px_10px/62%_62%_10px_10px] bg-emerald-tint flex items-center justify-center text-primary mx-auto mb-4">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {c.icon}
                </svg>
              </div>
              <div className="text-[12.5px] font-bold tracking-[0.08em] uppercase text-taupe-light mb-2">
                {c.label}
              </div>
              <div className="text-base text-ink-strong leading-[1.6]">
                {c.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
