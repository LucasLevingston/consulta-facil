"use client";

import {
	BarChart3,
	Calendar,
	CreditCard,
	DollarSign,
	Users,
} from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SECTIONS = [
	{
		href: "/admin/analytics/financial",
		icon: DollarSign,
		title: "Financeiro",
		description: "Receita, pagamentos e taxas do sistema",
	},
	{
		href: "/admin/analytics/users",
		icon: Users,
		title: "Usuarios",
		description: "Crescimento e distribuicao de usuarios",
	},
	{
		href: "/admin/analytics/appointments",
		icon: Calendar,
		title: "Consultas",
		description: "Volume, status e modalidade das consultas",
	},
	{
		href: "/admin/analytics/referrals",
		icon: Users,
		title: "Indicacoes",
		description: "Programa de indicacao e comissoes",
	},
	{
		href: "/admin/analytics/subscriptions",
		icon: CreditCard,
		title: "Assinaturas",
		description: "Status e distribuicao dos planos",
	},
];

export default function AnalyticsHubPage() {
	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Analytics e Relatorios"
				description="Dashboards de monitoramento da plataforma."
				icon={<BarChart3 className="h-6 w-6" />}
			/>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{SECTIONS.map((s) => (
					<Link key={s.href} href={s.href}>
						<Card className="cursor-pointer transition-colors hover:bg-muted/50 h-full">
							<CardHeader className="flex flex-row items-center gap-3 pb-2">
								<s.icon className="h-5 w-5 text-muted-foreground" />
								<CardTitle className="text-base">{s.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">{s.description}</p>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
