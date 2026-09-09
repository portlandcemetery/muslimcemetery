import type { CSSProperties } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AdminMobileHeader } from "@/components/admin-mobile-header";
import { auth } from "@/services/auth/auth";
import { db } from "@/services/db/index";
import { profiles } from "@/services/db/schema";
import type { UserRole } from "@/lib/types";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authoritative auth + access gate for the whole dashboard.
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/");

  const [profile] = await db
    .select({ role: profiles.role })
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);
  if (!profile) redirect("/");

  return (
    <SidebarProvider
      className="font-hanken bg-background text-foreground"
      style={{ "--sidebar-width": "264px" } as CSSProperties}
    >
      <AppSidebar role={profile.role as UserRole} />
      <SidebarInset className="flex h-svh flex-col bg-background">
        <AdminMobileHeader />
        <div className="flex-1 min-h-0 overflow-y-auto dash-scroll">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
