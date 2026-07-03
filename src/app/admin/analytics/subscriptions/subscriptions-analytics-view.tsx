"use client";

import { CreditCard } from "lucide-react";
import { AnalyticsBarChart } from "@/components/analytics/charts/AnalyticsBarChart";
import { AnalyticsDonutChart } from "@/components/analytics/charts/AnalyticsDonutChart";
import { KpiCard } from "@/components/analytics/KpiCard";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscriptionAnalytics } from "@/features/analytics";

function SubscriptionAnalyticsContent() {
	const { data } = useSubscriptionAnalytics();

	return (
		<>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
				{data.kpis.map((kpi) => (
					<KpiCard key={kpi.label} kpi={kpi} />
				))}
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Por Status</CardTitle>
					</CardHeader>
					<CardContent>
						<AnalyticsDonutChart data={data.statusBreakdown} />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Por Plano</CardTitle>
					</CardHeader>
					<CardContent>
						<AnalyticsBarChart
							data={data.planBreakdown}
							color="hsl(var(--chart-5))"
						/>
					</CardContent>
				</Card>
			</div>
		</>
	);
}

export function SubscriptionAnalyticsView() {
	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Analytics de Assinaturas"
				description="Status e distribuicao dos planos de assinatura."
				icon={<CreditCard className="h-6 w-6" />}
			/>

			<SuspenseBoundary>
				<SubscriptionAnalyticsContent />
			</SuspenseBoundary>
		</div>
	);
}
