"use client";

import { Users } from "lucide-react";
import { AnalyticsDonutChart } from "@/components/analytics/charts/AnalyticsDonutChart";
import { AnalyticsLineChart } from "@/components/analytics/charts/AnalyticsLineChart";
import { KpiCard } from "@/components/analytics/KpiCard";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReferralAnalytics } from "./use-referral-analytics";

function ReferralAnalyticsContent() {
	const { data } = useReferralAnalytics();

	return (
		<>
			<div className="grid gap-4 sm:grid-cols-3">
				{data.kpis.map((kpi) => (
					<KpiCard key={kpi.label} kpi={kpi} />
				))}
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-base">
							Indicacoes por Mes (12 meses)
						</CardTitle>
					</CardHeader>
					<CardContent>
						<AnalyticsLineChart
							data={data.referralSeries}
							label="Indicacoes"
							color="hsl(var(--chart-4))"
						/>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Por Status</CardTitle>
					</CardHeader>
					<CardContent>
						<AnalyticsDonutChart data={data.statusBreakdown} />
					</CardContent>
				</Card>
			</div>
		</>
	);
}

export function ReferralAnalyticsView() {
	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Analytics de Indicacoes"
				description="Programa de indicacao e comissoes."
				icon={<Users className="h-6 w-6" />}
			/>

			<SuspenseBoundary>
				<ReferralAnalyticsContent />
			</SuspenseBoundary>
		</div>
	);
}
