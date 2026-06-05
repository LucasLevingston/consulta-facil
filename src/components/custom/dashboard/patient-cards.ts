import { Building2, CalendarPlus, Stethoscope, User } from "lucide-react";
import type { QuickCard } from "./quick-card";

export const patientCards: QuickCard[] = [
	{
		title: "Agendar Consulta",
		description: "Escolha um profissional e agende um horário.",
		href: "/dashboard/appointments/create",
		icon: CalendarPlus,
		accent: "bg-green-500/10 text-green-500",
	},
	{
		title: "Profissionais",
		description: "Explore profissionais cadastrados na plataforma.",
		href: "/professionals",
		icon: Stethoscope,
		accent: "bg-blue-500/10 text-blue-500",
	},
	{
		title: "Clínicas",
		description: "Encontre clínicas próximas de você.",
		href: "/clinics",
		icon: Building2,
		accent: "bg-teal-500/10 text-teal-500",
	},
	{
		title: "Meu Perfil",
		description: "Atualize seus dados pessoais e preferências.",
		href: "/dashboard/profile",
		icon: User,
		accent: "bg-purple-500/10 text-purple-500",
	},
];
