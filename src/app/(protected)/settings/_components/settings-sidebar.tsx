"use client";

import { usePathname } from "next/navigation";

import {
  DashboardSidebarNav,
  DashboardSidebarNavLink,
  DashboardSidebarNavMain,
} from "@/components/dashboard/sidebar";

export function SettingsSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <aside>
      <DashboardSidebarNav>
        <DashboardSidebarNavMain>
          <DashboardSidebarNavLink href="/settings" active={isActive("/settings")}>
            Meu perfil
          </DashboardSidebarNavLink>
          <DashboardSidebarNavLink
            href="/settings/theme"
            active={isActive("/settings/theme")}
          >
            Tema
          </DashboardSidebarNavLink>
          <DashboardSidebarNavLink
            href="/settings/billing"
            active={isActive("/settings/billing")}
          >
            Assinatura
          </DashboardSidebarNavLink>
        </DashboardSidebarNavMain>
      </DashboardSidebarNav>
    </aside>
  );
}
