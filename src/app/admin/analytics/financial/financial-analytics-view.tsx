"use client";

import { DollarSign } from "lucide-react";
import { AnalyticsBarChart } from "@/components/analytics/charts/AnalyticsBarChart";
import { AnalyticsDonutChart } from "@/components/analytics/charts/AnalyticsDonutChart";
import { AnalyticsLineChart } from "@/components/analytics/charts/AnalyticsLineChart";
import { KpiCard } from "@/components/analytics/KpiCard";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinancialAnalytics } from "@/features/analytics";

const brl = (n: number) =>
	new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
		n,
	);

function FinancialAnalyticsContent() {
	const { data } = useFinancialAnalytics();

	return (
		<>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
				{data.kpis.map((kpi) => (
					<KpiCard key={kpi.label} kpi={kpi} />
				))}
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">
						Receita por Mes (12 meses)
					</CardTitle>
				</CardHeader>
				<CardContent>
					<AnalyticsLineChart
						data={data.revenueSeries}
						label="Receita"
						valueFormatter={brl}
					/>
				</CardContent>
			</Card>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Por Status</CardTitle>
					</CardHeader>
					<CardContent>
						<AnalyticsBarChart
							data={data.statusBreakdown}
							color="hsl(var(--chart-2))"
						/>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Por Tipo de Pagamento</CardTitle>
					</CardHeader>
					<CardContent>
						<AnalyticsDonutChart data={data.paymentTypeBreakdown} />
					</CardContent>
				</Card>
			</div>
		</>
	);
}

export function FinancialAnalyticsView() {
	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Analytics Financeiro"
				description="Receita, pagamentos e taxas do sistema."
				icon={<DollarSign className="h-6 w-6" />}
			/>

			<SuspenseBoundary>
				<FinancialAnalyticsContent />
			</SuspenseBoundary>
		</div>
	);
}
