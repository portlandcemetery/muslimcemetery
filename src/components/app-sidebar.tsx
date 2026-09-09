"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Sprout,
  FileText,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/services/auth/auth-client";
import type { UserRole } from "@/lib/types";

type NavItem = { href: string; label: string; icon: LucideIcon; roles: UserRole[] };

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "operator"] },
  { href: "/gardens", label: "Gardens", icon: Sprout, roles: ["admin", "operator", "viewer"] },
  { href: "/reports", label: "Reports", icon: FileText, roles: ["admin", "operator"] },
  { href: "/settings", label: "Settings", icon: Settings, roles: ["admin"] },
];

export function AppSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const nav = NAV.filter((item) => item.roles.includes(role));

  const isActive = (href: string) =>
    pathname === href ||
    pathname.startsWith(`${href}/`) ||
    (href === "/gardens" && pathname.startsWith("/plots"));

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border">
      <SidebarHeader className="p-0 border-b border-sidebar-border">
        <Link
          href="/"
          title="View public site"
          className="flex items-center gap-3 p-[22px] hover:bg-secondary/60 transition-colors"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/icp-mark.png" alt="" className="h-[38px] w-auto block" />
          <div className="leading-[1.15]">
            <div className="font-bold text-[15px] tracking-[-0.01em]">
              Islamic Center
            </div>
            <div className="text-[11px] tracking-[0.12em] uppercase text-muted-foreground/90 font-semibold">
              Memorial Gardens
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-[14px]">
        <SidebarMenu className="gap-1">
          {nav.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                isActive={isActive(item.href)}
                onClick={() => setOpenMobile(false)}
                render={<Link href={item.href} />}
                className="h-auto py-3 px-[15px] gap-[13px] rounded-[11px] text-[15.5px] font-medium text-sidebar-foreground/85 hover:bg-secondary hover:text-foreground data-active:bg-primary/10 data-active:text-primary data-active:font-semibold [&_svg]:size-[19px]"
              >
                <item.icon strokeWidth={2} />
                {item.label}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-[14px] border-t border-sidebar-border">
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={async () => {
                setOpenMobile(false);
                await authClient.signOut();
                router.push("/");
                router.refresh();
              }}
              className="h-auto py-3 px-[15px] gap-[13px] rounded-[11px] text-[15.5px] font-medium text-destructive hover:bg-destructive/10 hover:text-destructive [&_svg]:size-[19px]"
            >
              <LogOut strokeWidth={2} />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
