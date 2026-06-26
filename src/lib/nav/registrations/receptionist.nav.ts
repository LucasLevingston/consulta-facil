import { CalendarDays, MonitorCheck, UserRound } from "lucide-react";
import { registerNavItem } from "../nav-registry";

registerNavItem({
	roles: ["RECEPTIONIST"],
	label: "Recepção",
	title: "Painel de Recepção",
	url: "/dashboard/reception",
	icon: MonitorCheck,
});
registerNavItem({
	roles: ["RECEPTIONIST"],
	label: "Recepção",
	title: "Consultas",
	url: "/dashboard/appointments",
	icon: CalendarDays,
});
registerNavItem({
	roles: ["RECEPTIONIST"],
	label: "Recepção",
	title: "Pacientes",
	url: "/dashboard/patients",
	icon: UserRound,
});
