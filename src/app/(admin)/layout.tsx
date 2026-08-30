import type { CSSProperties } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AdminMobileHeader } from "@/components/admin-mobile-header";

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
      <SidebarInset className="flex h-svh flex-col bg-background">
        <AdminMobileHeader />
        <div className="flex-1 min-h-0 overflow-y-auto dash-scroll">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
