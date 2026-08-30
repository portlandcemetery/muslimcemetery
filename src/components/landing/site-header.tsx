const NAV_LINKS = [
  { href: "#mission", label: "Mission" },
  { href: "#rules", label: "Cemetery Rules" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 bg-background/[0.88] backdrop-blur-[10px] border-b border-border">
      <div className="max-w-[1120px] mx-auto py-[14px] px-9 flex items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-[13px] text-foreground">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/icp-mark.png"
            alt="Islamic Center of Portland"
            className="h-10 w-auto block"
          />
          <span className="flex flex-col leading-[1.12]">
            <span className="font-bold text-[17px] tracking-[-0.01em]">
              Islamic Center of Portland
            </span>
            <span className="text-[11.5px] tracking-[0.14em] uppercase text-taupe font-semibold">
              Memorial Gardens
            </span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-[9px] px-[15px] text-slate text-[14.5px] font-medium rounded-lg transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#portal"
            className="ml-[10px] py-[10px] px-5 bg-primary text-primary-foreground text-[14.5px] font-semibold rounded-full transition-colors hover:bg-primary-hover"
          >
            Portal Sign In
          </a>
        </nav>
      </div>
    </header>
  );
}
