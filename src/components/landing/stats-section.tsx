const STATS = [
  { value: "2015", label: "Established" },
  { value: "5.5", label: "Acres of grounds" },
  { value: "3", label: "Section gardens" },
  { value: "3,800", label: "Total capacity" },
];

export function StatsSection() {
  return (
    <section className="bg-background border-y border-border">
      <div className="max-w-[1120px] mx-auto px-9 py-[54px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-5">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-extrabold text-[40px] md:text-[46px] leading-none tracking-[-0.02em] text-primary">
                {s.value}
              </div>
              <div className="mt-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-muted-foreground/85">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
