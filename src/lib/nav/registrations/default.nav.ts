import { Building2, Home, Users } from "lucide-react";
import { registerNavItem } from "../nav-registry";

registerNavItem({
	roles: ["PATIENT", "PROFESSIONAL", "ADMIN", "RECEPTIONIST"],
	label: "Home",
	title: "Dashboard",
	url: "/dashboard",
	icon: Home,
	tooltip: "Visão geral da sua conta e atividades recentes",
});
registerNavItem({
	roles: ["PATIENT", "PROFESSIONAL", "ADMIN", "RECEPTIONIST"],
	label: "Home",
	title: "Profissionais",
	url: "/professionals",
	icon: Users,
	tooltip: "Profissionais cadastrados na plataforma",
});
registerNavItem({
	roles: ["PATIENT", "PROFESSIONAL", "ADMIN", "RECEPTIONIST"],
	label: "Home",
	title: "Clínicas",
	url: "/clinics",
	icon: Building2,
	tooltip: "Clínicas cadastradas na plataforma",
});
