import { TodayDate } from "./today-date";

export function DashboardHeader() {
  return (
    <div className="mb-[30px]">
      <h1 className="font-extrabold text-[28px] sm:text-[38px] tracking-[-0.02em] mb-[6px]">
        Memorial Gardens Overview
      </h1>
      <p className="text-[15.5px] text-muted-foreground">
        Assalamu alaikum, Br. Yusuf ·{" "}
        <span className="text-muted-foreground/90">
          Operational status for <TodayDate />
        </span>
      </p>
    </div>
  );
}
