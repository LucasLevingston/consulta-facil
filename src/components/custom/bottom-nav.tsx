"use client";

import {
	BadgeCheck,
	CalendarClock,
	CalendarDays,
	CalendarPlus,
	Clock,
	Home,
	MonitorCheck,
	UserRound,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";

type NavItem = {
	title: string;
	url: string;
	icon: React.ComponentType<{ className?: string }>;
};

const navByRole: Record<string, NavItem[]> = {
	PATIENT: [
		{ title: "Início", url: "/dashboard", icon: Home },
		{ title: "Consultas", url: "/dashboard/appointments", icon: CalendarDays },
		{
			title: "Agendar",
			url: "/dashboard/appointments/create",
			icon: CalendarPlus,
		},
		{
			title: "Solicitações",
			url: "/dashboard/procedure-requests",
			icon: CalendarClock,
		},
		{ title: "Profissionais", url: "/professionals", icon: Users },
	],
	PROFESSIONAL: [
		{ title: "Início", url: "/dashboard", icon: Home },
		{ title: "Consultas", url: "/dashboard/appointments", icon: CalendarDays },
		{ title: "Pacientes", url: "/dashboard/patients", icon: UserRound },
		{
			title: "Procedimentos",
			url: "/dashboard/procedure-requests",
			icon: CalendarClock,
		},
		{ title: "Horários", url: "/dashboard/schedule", icon: Clock },
	],
	RECEPTIONIST: [
		{ title: "Início", url: "/dashboard", icon: Home },
		{ title: "Recepção", url: "/dashboard/reception", icon: MonitorCheck },
		{ title: "Consultas", url: "/dashboard/appointments", icon: CalendarDays },
		{ title: "Pacientes", url: "/dashboard/patients", icon: UserRound },
	],
	ADMIN: [
		{ title: "Início", url: "/dashboard", icon: Home },
		{ title: "Consultas", url: "/dashboard/appointments", icon: CalendarDays },
		{ title: "Pacientes", url: "/dashboard/patients", icon: UserRound },
		{ title: "Admin", url: "/admin", icon: BadgeCheck },
	],
};

export function BottomNav() {
	const { user } = useUserStore();
	const pathname = usePathname();

	if (!user) return null;

	const items = navByRole[user.role] ?? navByRole.PATIENT;

	const isActive = (url: string) =>
		url === "/dashboard" ? pathname === url : pathname.startsWith(url);

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 pb-safe backdrop-blur-xl md:hidden">
			<div className="flex items-center justify-around px-1 py-2">
				{items.map((item) => {
					const active = isActive(item.url);
					return (
						<Link
							key={item.url}
							href={item.url}
							className={cn(
								"flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-xs font-medium transition-colors",
								active
									? "text-primary"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							<item.icon
								className={cn(
									"h-5 w-5 shrink-0 transition-transform",
									active && "scale-110",
								)}
							/>
							<span className="truncate leading-none">{item.title}</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
