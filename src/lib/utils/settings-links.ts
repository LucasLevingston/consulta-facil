import {
	BadgeCheck,
	Building2,
	Clock,
	CreditCard,
	Palette,
	Share2,
	Stethoscope,
	Tag,
	User,
	Wallet,
} from "lucide-react";

type NavLink = {
	href: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	roles?: string[];
};

export const SETTINGS_LINKS: NavLink[] = [
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
		href: "/settings/wallet",
		label: "Carteira",
		icon: Wallet,
		roles: ["PATIENT", "PROFESSIONAL"],
	},
	{
		href: "/settings/referrals",
		label: "Indicações",
		icon: Share2,
		roles: ["PATIENT", "PROFESSIONAL"],
	},
	{
		href: "/settings/coupons",
		label: "Cupons",
		icon: Tag,
		roles: ["PATIENT", "PROFESSIONAL"],
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
