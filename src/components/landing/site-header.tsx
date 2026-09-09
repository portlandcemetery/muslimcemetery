"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#pricing", label: "Pricing" },
  { href: "#process", label: "Process" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-background/[0.88] backdrop-blur-[10px] border-b border-border">
      <div className="max-w-[1120px] mx-auto py-[14px] px-6 sm:px-9 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-[13px] text-foreground">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/icop-logo.png"
            alt="Islamic Center of Portland"
            className="h-11 w-auto block"
          />
          <span className="flex flex-col leading-[1.12]">
            <span className="font-bold text-[15px] sm:text-[17px] tracking-[-0.01em]">
              Muslim Cemetery of Portland
            </span>
            <span className="text-[10.5px] sm:text-[11.5px] tracking-[0.14em] uppercase text-muted-foreground/90 font-semibold">
              Islamic Center of Portland
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-[9px] px-[15px] text-foreground/85 text-[14.5px] font-medium rounded-lg transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#portal"
            className={cn(
              buttonVariants(),
              "ml-[10px] h-auto py-[10px] px-5 text-[14.5px] font-semibold rounded-full",
            )}
          >
            Portal Sign In
          </a>
        </nav>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="#portal"
            onClick={() => setOpen(false)}
            className={cn(
              buttonVariants(),
              "h-auto py-[9px] px-4 text-[13.5px] font-semibold rounded-full",
            )}
          >
            Sign In
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="h-10 w-10 flex items-center justify-center rounded-lg border border-border text-foreground/80 transition-colors hover:bg-muted"
          >
            {open ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="md:hidden border-t border-border bg-background/95 backdrop-blur-[10px] px-6 sm:px-9">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-[13px] text-[15.5px] font-medium text-foreground/85 border-b border-border/60 last:border-b-0 transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
