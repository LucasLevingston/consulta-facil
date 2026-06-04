import {
	BadgeCheck,
	Building2,
	Clock,
	CreditCard,
	Palette,
	Stethoscope,
	User,
} from "lucide-react";

type NavLink = {
	href: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	roles?: string[];
};

export const ALL_LINKS: NavLink[] = [
	{ href: "/settings", label: "Meu perfil", icon: User },
	{ href: "/settings/theme", label: "Tema", icon: Palette },
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
