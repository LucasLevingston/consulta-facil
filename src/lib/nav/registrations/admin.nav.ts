import {
	BadgeCheck,
	Briefcase,
	CalendarClock,
	CalendarDays,
	CreditCard,
	Settings,
	User,
	Users,
} from "lucide-react";
import { registerNavItem } from "../nav-registry";

registerNavItem({
	roles: ["ADMIN"],
	label: "Administração",
	title: "Consultas",
	url: "/dashboard/appointments",
	icon: CalendarDays,
});
registerNavItem({
	roles: ["ADMIN"],
	label: "Administração",
	title: "Pacientes",
	url: "/dashboard/patients",
	icon: BadgeCheck,
});
registerNavItem({
	roles: ["ADMIN"],
	label: "Administração",
	title: "Usuários",
	url: "/dashboard/users",
	icon: Users,
});
registerNavItem({
	roles: ["ADMIN"],
	label: "Administração",
	title: "Pagamentos",
	url: "/dashboard/payments",
	icon: CreditCard,
});
registerNavItem({
	roles: ["ADMIN"],
	label: "Administração",
	title: "Admin Dashboard",
	url: "/admin",
	icon: Settings,
});
registerNavItem({
	roles: ["ADMIN"],
	label: "Procedimentos",
	title: "Meus Serviços",
	url: "/dashboard/services",
	icon: Briefcase,
});
registerNavItem({
	roles: ["ADMIN"],
	label: "Procedimentos",
	title: "Solicitações",
	url: "/dashboard/procedure-requests",
	icon: CalendarClock,
});
registerNavItem({
	roles: ["ADMIN"],
	label: "Conta",
	title: "Meu Perfil",
	url: "/dashboard/profile",
	icon: User,
});
registerNavItem({
	roles: ["ADMIN"],
	label: "Conta",
	title: "Configurações",
	url: "/settings",
	icon: Settings,
});
