import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AdminMobileHeader() {
  return (
    <header className="flex md:hidden flex-none items-center gap-3 bg-sidebar border-b border-sidebar-border px-4 py-3">
      <SidebarTrigger className="size-9 text-foreground" />
      <Link href="/" title="View public site" className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/icp-mark.png" alt="" className="h-7 w-auto block" />
        <div className="leading-[1.15]">
          <div className="font-bold text-[14px] tracking-[-0.01em]">
            Islamic Center
          </div>
          <div className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground/90 font-semibold">
            Memorial Gardens
          </div>
        </div>
      </Link>
    </header>
  );
}
