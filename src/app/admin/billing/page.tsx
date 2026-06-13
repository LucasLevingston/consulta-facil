"use client";

import {
	BadgePercent,
	CreditCard,
	FileText,
	Settings,
	Sliders,
	Tag,
	Users,
	Wallet,
} from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SECTIONS = [
	{
		href: "/admin/billing/payments",
		icon: CreditCard,
		title: "Pagamentos",
		description: "Todos os pagamentos processados",
	},
	{
		href: "/admin/billing/invoices",
		icon: FileText,
		title: "Notas Fiscais",
		description: "Notas fiscais geradas",
	},
	{
		href: "/admin/billing/features",
		icon: Tag,
		title: "Features",
		description: "Recursos dos planos",
	},
	{
		href: "/admin/billing/system-fees",
		icon: Sliders,
		title: "Taxas do Sistema",
		description: "Taxas cobradas por tipo de pagamento",
	},
	{
		href: "/admin/billing/settings",
		icon: Settings,
		title: "Configurações",
		description: "Configurações globais de cobrança",
	},
	{
		href: "/admin/billing/coupons",
		icon: Tag,
		title: "Cupons",
		description: "Historico de uso de cupons",
	},
	{
		href: "/admin/billing/referrals",
		icon: Users,
		title: "Indicacoes",
		description: "Programa de indicacao",
	},
	{
		href: "/admin/billing/commissions",
		icon: BadgePercent,
		title: "Comissoes",
		description: "Comissoes de indicacao",
	},
	{
		href: "/admin/billing/wallets",
		icon: Wallet,
		title: "Carteiras",
		description: "Carteiras financeiras dos usuarios",
	},
];

export default function AdminBillingPage() {
	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Módulo Financeiro"
				description="Gerencie pagamentos, planos e configurações de cobrança."
				icon={<Wallet className="h-6 w-6" />}
			/>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{SECTIONS.map(({ href, icon: Icon, title, description }) => (
					<Link key={href} href={href}>
						<Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
							<CardHeader className="flex flex-row items-center gap-3 pb-2">
								<Icon className="h-5 w-5 text-primary" />
								<CardTitle className="text-base">{title}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">{description}</p>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
