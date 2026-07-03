"use client";

import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import {
	Sidebar,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import "@/lib/nav/load-nav";
import { useEffect, useState } from "react";
import { useAuthStore, useUserStore } from "@/features/auth";
import type { UserRole } from "@/lib/nav/nav-registry";
import { getNavGroupsForRole } from "@/lib/nav/nav-registry";
import { SidebarFooterMenu } from "./SidebarFooterMenu";
import { SidebarNavContent } from "./SidebarNavContent";

export default function AppSidebar() {
	const [mounted, setMounted] = useState(false);
	const { isAuthenticated, logout } = useAuthStore();
	const { user } = useUserStore();
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		setMounted(true);
	}, []);
	if (!mounted) return null;

	const role = (user?.role ?? "PATIENT") as UserRole;
	const navigation = getNavGroupsForRole(role);

	const initials = user?.name
		? user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.slice(0, 2)
				.toUpperCase()
		: (user?.email?.slice(0, 2).toUpperCase() ?? "CF");

	const displayName = user?.name ?? user?.email ?? "Usuário";
	const isProfessional = user?.role === "PROFESSIONAL";
	const isAdmin = user?.role === "ADMIN";
	const isReceptionist = user?.role === "RECEPTIONIST";

	const handleLogout = () => {
		logout();
		Cookies.remove("auth_token");
		router.push("/auth");
	};

	const isActive = (url: string) =>
		url === "/dashboard" ? pathname === url : pathname.startsWith(url);

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<Logo />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarNavContent navigation={navigation} isActive={isActive} />
			{isAuthenticated && user && (
				<SidebarFooterMenu
					displayName={displayName}
					initials={initials}
					imageUrl={user.imageUrl}
					email={user.email}
					isAdmin={isAdmin}
					isProfessional={isProfessional}
					isReceptionist={isReceptionist}
					onLogout={handleLogout}
				/>
			)}
			<SidebarRail />
		</Sidebar>
	);
}
