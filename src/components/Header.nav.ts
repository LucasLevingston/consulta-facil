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
import type { ComponentType } from "react";

export type NavItem = {
	title: string;
	url: string;
	icon: ComponentType<{ className?: string }>;
};

export const navByRole: Record<string, NavItem[]> = {
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
		{ title: "Exames", url: "/dashboard/exams", icon: CalendarPlus },
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
		{ title: "Solicitações", url: "/admin/requests", icon: UserRound },
		{ title: "Pagamentos", url: "/admin/payments", icon: RiMoneyCnyBoxFill },
		{ title: "Uso", url: "/admin/usage", icon: BadgeCheck },
	],
};
