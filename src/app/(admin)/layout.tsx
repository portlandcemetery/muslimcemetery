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
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
