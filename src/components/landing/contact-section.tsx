import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

type ContactCard = { label: string; icon: ReactNode; body: ReactNode };

const CARDS: ContactCard[] = [
  {
    label: "Cemetery",
    icon: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    body: (
      <a
        href="https://www.google.com/maps/search/?api=1&query=21207+NW+St+Helens+Rd+Portland+OR+97231"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-primary transition-colors"
      >
        21207 NW St Helens Rd
        <br />
        Portland, OR 97231
      </a>
    ),
  },
  {
    label: "Islamic Center office",
    icon: (
      <>
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-6h6v6" />
      </>
    ),
    body: (
      <a
        href="https://www.google.com/maps/search/?api=1&query=6940+SW+Hall+Blvd+Beaverton+OR+97008"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-primary transition-colors"
      >
        6940 SW Hall Blvd
        <br />
        Beaverton, OR 97008
      </a>
    ),
  },
  {
    label: "Call",
    icon: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    ),
    body: (
      <span className="flex flex-col gap-[3px] text-[15px]">
        <a href="tel:+15039982498" className="hover:text-primary transition-colors">
          Ali Houdroge · 503-998-2498
        </a>
        <a href="tel:+15033818229" className="hover:text-primary transition-colors">
          Br Shams · 503-381-8229
        </a>
        <a href="tel:+15033812721" className="hover:text-primary transition-colors">
          Haj Muhsen · 503-381-2721
        </a>
        <a
          href="tel:+15035269305"
          className="text-muted-foreground/80 hover:text-primary transition-colors"
        >
          Office · 503-526-9305
        </a>
      </span>
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
    body: (
      <a href="mailto:portlandicp@gmail.com" className="hover:text-primary">
        portlandicp@gmail.com
      </a>
    ),
  },
];

const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/groups/47040881309/" },
  {
    label: "Instagram",
    href: "https://www.instagram.com/pdxyouthofahlulbayt/profilecard/?igsh=MTNoYXk1ZGlkNmJybA==",
  },
  { label: "YouTube", href: "https://www.youtube.com/@islamiccenterportland" },
];

export function ContactSection() {
  return (
    <section
      id="contact"
      className="scroll-mt-[100px] bg-background border-t border-border"
    >
      <div className="max-w-[1120px] mx-auto py-[82px] px-9">
        <h2 className="font-extrabold text-[34px] tracking-[-0.02em] mb-[10px] text-center">
          Address &amp; contact
        </h2>
        <p className="text-[15.5px] text-muted-foreground text-center mb-[34px] max-w-[60ch] mx-auto">
          Look for the green highway sign — the cemetery is about 1.7 miles from
          the Cornelius Pass exit toward Scappoose.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CARDS.map((c) => (
            <Card
              key={c.label}
              className="border-border rounded-2xl py-[28px] px-6 text-center items-center gap-0"
            >
              <div className="w-[46px] h-[46px] rounded-[50%_50%_10px_10px/62%_62%_10px_10px] bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
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
              <div className="text-[12.5px] font-bold tracking-[0.08em] uppercase text-muted-foreground/80 mb-2">
                {c.label}
              </div>
              <div className="text-[15px] text-card-foreground leading-[1.6]">
                {c.body}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="py-[9px] px-[18px] rounded-full border border-border bg-card text-[14px] font-semibold text-foreground/80 transition-colors hover:border-primary hover:text-primary"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
