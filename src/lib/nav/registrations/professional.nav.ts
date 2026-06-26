import {
	Briefcase,
	Building2,
	CalendarClock,
	CalendarDays,
	CalendarPlus,
	Clock,
	CreditCard,
	FlaskConical,
	MessageCircle,
	TrendingUp,
	UserRound,
} from "lucide-react";
import { registerNavItem } from "../nav-registry";

registerNavItem({
	roles: ["PROFESSIONAL"],
	label: "Consultas",
	title: "Consultas",
	url: "/dashboard/appointments",
	icon: CalendarDays,
});
registerNavItem({
	roles: ["PROFESSIONAL"],
	label: "Consultas",
	title: "Agendar Consulta",
	url: "/dashboard/appointments/create",
	icon: CalendarPlus,
});
registerNavItem({
	roles: ["PROFESSIONAL"],
	label: "Pacientes",
	title: "Pacientes",
	url: "/dashboard/patients",
	icon: UserRound,
});
registerNavItem({
	roles: ["PROFESSIONAL"],
	label: "Pacientes",
	title: "Mensagens",
	url: "/dashboard/messages",
	icon: MessageCircle,
});
registerNavItem({
	roles: ["PROFESSIONAL"],
	label: "Procedimentos",
	title: "Meus Serviços",
	url: "/dashboard/services",
	icon: Briefcase,
	tooltip: "Serviços e procedimentos que você oferece",
});
registerNavItem({
	roles: ["PROFESSIONAL"],
	label: "Procedimentos",
	title: "Solicitações",
	url: "/dashboard/procedure-requests",
	icon: CalendarClock,
	tooltip: "Solicitações de procedimento para pacientes",
});
registerNavItem({
	roles: ["PROFESSIONAL"],
	label: "Procedimentos",
	title: "Exames",
	url: "/dashboard/exams",
	icon: FlaskConical,
	tooltip: "Exames solicitados para seus pacientes",
});
registerNavItem({
	roles: ["PROFESSIONAL"],
	label: "Clínica",
	title: "Minha Clínica",
	url: "/dashboard/my-clinic",
	icon: Building2,
});
registerNavItem({
	roles: ["PROFESSIONAL"],
	label: "Clínica",
	title: "Horários",
	url: "/dashboard/schedule",
	icon: Clock,
});
registerNavItem({
	roles: ["PROFESSIONAL"],
	label: "Financeiro",
	title: "Financeiro",
	url: "/dashboard/financial",
	icon: TrendingUp,
});
registerNavItem({
	roles: ["PROFESSIONAL"],
	label: "Financeiro",
	title: "Pagamentos",
	url: "/dashboard/payments",
	icon: CreditCard,
});
