"use client";

import {
	BadgeCheck,
	Building2,
	Clock,
	CreditCard,
	Palette,
	Stethoscope,
	User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";
import { useUserStore } from "@/store/useUserStore";

type NavLink = {
	href: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	roles?: string[];
};

const ALL_LINKS: NavLink[] = [
	{
		href: "/settings",
		label: "Meu perfil",
		icon: User,
	},
	{
		href: "/settings/theme",
		label: "Tema",
		icon: Palette,
	},
	{
		href: "/settings/schedule",
		label: "Horários",
		icon: Clock,
		roles: ["PROFESSIONAL"],
	},
	{
		href: "/settings/my-clinic",
		label: "Minha Clínica",
		icon: Building2,
		roles: ["PROFESSIONAL"],
	},
	{
		href: "/settings/services",
		label: "Serviços",
		icon: Stethoscope,
		roles: ["PROFESSIONAL"],
	},
	{
		href: "/settings/billing",
		label: "Assinatura",
		icon: CreditCard,
		roles: ["PATIENT", "PROFESSIONAL"],
	},
	{
		href: "/settings/billing/clinic",
		label: "Plano da Clínica",
		icon: BadgeCheck,
		roles: ["PROFESSIONAL", "ADMIN"],
	},
];

export function SettingsSidebar() {
	const pathname = usePathname();
	const { user } = useUserStore();
	const role = user?.role ?? "PATIENT";

	const links = ALL_LINKS.filter(
		(link) => !link.roles || link.roles.includes(role),
	);

	return (
		<aside className="w-48 shrink-0">
			<nav className="flex flex-col gap-1">
				{links.map(({ href, label, icon: Icon }) => (
					<Link
						key={href}
						href={href}
						className={cn(
							"flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
							pathname === href || pathname.startsWith(`${href}/`)
								? "bg-primary/10 text-primary"
								: "text-muted-foreground hover:bg-muted hover:text-foreground",
						)}
					>
						<Icon className="h-4 w-4 shrink-0" />
						{label}
					</Link>
				))}
			</nav>
		</aside>
	);
}
