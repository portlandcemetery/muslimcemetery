export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground/80 border-t-[3px] border-accent">
      <div className="max-w-[1120px] mx-auto py-[30px] px-9 flex items-center justify-between gap-5 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-[13.5px] text-primary-foreground/80">
            © 2026 Islamic Center of Portland · Memorial Gardens
          </span>
        </div>
        <span className="text-[13.5px] text-primary-foreground/60">
          Sunnah-compliant cemetery administration
        </span>
      </div>
    </footer>
  );
}
