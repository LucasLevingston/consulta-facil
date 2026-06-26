import {
	CalendarClock,
	CalendarDays,
	CalendarPlus,
	FlaskConical,
	MessageCircle,
	Users,
} from "lucide-react";
import { registerNavItem } from "../nav-registry";

registerNavItem({
	roles: ["PATIENT"],
	label: "Consultas",
	title: "Minhas Consultas",
	url: "/dashboard/appointments",
	icon: CalendarDays,
});
registerNavItem({
	roles: ["PATIENT"],
	label: "Consultas",
	title: "Agendar Consulta",
	url: "/dashboard/appointments/create",
	icon: CalendarPlus,
});
registerNavItem({
	roles: ["PATIENT"],
	label: "Consultas",
	title: "Solicitações",
	url: "/dashboard/procedure-requests",
	icon: CalendarClock,
	tooltip: "Procedimentos solicitados pelo seu profissional",
});
registerNavItem({
	roles: ["PATIENT"],
	label: "Consultas",
	title: "Exames",
	url: "/dashboard/exams",
	icon: FlaskConical,
	tooltip: "Exames solicitados pelos seus profissionais",
});
registerNavItem({
	roles: ["PATIENT"],
	label: "Consultas",
	title: "Dependentes",
	url: "/dashboard/dependents",
	icon: Users,
});
registerNavItem({
	roles: ["PATIENT"],
	label: "Consultas",
	title: "Mensagens",
	url: "/dashboard/messages",
	icon: MessageCircle,
});
