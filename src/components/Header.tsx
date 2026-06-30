"use client";

import { RiMoneyCnyBoxFill } from "@remixicon/react";
import {
	BadgeCheck,
	Building2,
	CalendarDays,
	CalendarPlus,
	FlaskConical,
	Home,
	MonitorCheck,
	TrendingUp,
	UserRound,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/features/auth";
import { cn } from "@/lib/utils/cn";
import { CustomButton } from "./custom/custom-button";
import { HeaderDropdown } from "./custom/header-dropdown";
import { NotificationBell } from "./custom/notifications/NotificationBell";
import { ThemeSwitcher } from "./custom/Theme-Switcher";
import { Logo } from "./logo";

type NavItem = {
	title: string;
	url: string;
	icon: React.ComponentType<{ className?: string }>;
};

const navByRole: Record<string, NavItem[]> = {
	DEFAULT: [
		{ title: "Dashboard", url: "/dashboard", icon: Home },
		{ title: "Profissionais", url: "/professionals", icon: Users },
		{ title: "Clínicas", url: "/clinics", icon: Building2 },
		{ title: "Laboratórios", url: "/laboratories", icon: FlaskConical },
	],
	PROTECTED: [
		{ title: "Consultas", url: "/dashboard/appointments", icon: CalendarDays },
	],
	PATIENT: [
		{
			title: "Agendar",
			url: "/dashboard/appointments/create",
			icon: CalendarPlus,
		},
		{
			title: "Exames",
			url: "/dashboard/exams",
			icon: CalendarPlus,
		},
	],
	PROFESSIONAL: [
		{ title: "Pacientes", url: "/dashboard/patients", icon: UserRound },
		{ title: "Financeiro", url: "/dashboard/financial", icon: TrendingUp },
	],
	RECEPTIONIST: [
		{ title: "Recepção", url: "/dashboard/reception", icon: MonitorCheck },
	],
	ADMIN: [
		{ title: "Usuários", url: "/admin/users", icon: UserRound },
		{
			title: "Solicitações",
			url: "/admin/requests",
			icon: UserRound,
		},
		{
			title: "Pagamentos",
			url: "/admin/payments",
			icon: RiMoneyCnyBoxFill,
		},
		{ title: "Uso", url: "/admin/usage", icon: BadgeCheck },
	],
};

export function Header() {
	const { user } = useUserStore();
	const pathname = usePathname();

	const items = user
		? [...navByRole.DEFAULT, ...(navByRole[user.role] ?? navByRole.PATIENT)]
		: [];

	const isActive = (url: string) =>
		url === "/dashboard" ? pathname === url : pathname === url;

	return (
		<header className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-3 py-3 backdrop-blur-xl sm:px-6">
			<div className="flex min-w-0 items-center gap-4">
				<Logo />

				{user && (
					<nav className="hidden items-center gap-0.5 md:flex">
						{items.map((item) => {
							const active = isActive(item.url);
							return (
								<Link
									key={item.url}
									href={item.url}
									className={cn(
										"flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
										active
											? "bg-primary/10 text-primary"
											: "text-muted-foreground hover:bg-muted hover:text-foreground",
									)}
								>
									<item.icon className="h-4 w-4 shrink-0" />
									{item.title}
								</Link>
							);
						})}
					</nav>
				)}
			</div>

			<div className="flex shrink-0 items-center gap-2">
				<ThemeSwitcher />

				{user ? (
					<>
						<NotificationBell />
						<HeaderDropdown user={user} />
					</>
				) : (
					<div className="flex items-center gap-2">
						<Link href="/auth/register" className="hidden sm:block">
							<CustomButton variant="outline">Criar conta</CustomButton>
						</Link>
						<Link href="/auth/login">
							<CustomButton>Entrar</CustomButton>
						</Link>
					</div>
				)}
			</div>
		</header>
	);
}
