import { Building2, Home, Users } from "lucide-react";

export const defaultNav = [
	{
		label: "Home",
		items: [
			{
				title: "Dashboard",
				url: "/dashboard",
				icon: Home,
				tooltip: "Visão geral da sua conta e atividades recentes",
			},
			{
				title: "Profissionais",
				url: "/professionals",
				icon: Users,
				tooltip: "Profissionais cadastrados na plataforma",
			},
			{
				title: "Clínicas",
				url: "/clinics",
				icon: Building2,
				tooltip: "Clínicas cadastradas na plataforma",
			},
		],
	},
];
