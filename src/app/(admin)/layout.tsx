import type { CSSProperties } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      className="font-hanken bg-background text-foreground"
      style={{ "--sidebar-width": "264px" } as CSSProperties}
    >
      <AppSidebar />
      <SidebarInset className="h-svh overflow-y-auto dash-scroll bg-background">
        <div className="px-[44px] pt-[38px] pb-[56px]">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
