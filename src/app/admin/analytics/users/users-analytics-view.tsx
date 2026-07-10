"use client";

import { Users } from "lucide-react";
import { AnalyticsDonutChart } from "@/components/analytics/charts/AnalyticsDonutChart";
import { AnalyticsLineChart } from "@/components/analytics/charts/AnalyticsLineChart";
import { KpiCard } from "@/components/analytics/KpiCard";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserAnalytics } from "./use-user-analytics";

function UserAnalyticsContent() {
	const { data } = useUserAnalytics();

	return (
		<>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{data.kpis.map((kpi) => (
					<KpiCard key={kpi.label} kpi={kpi} />
				))}
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Crescimento (12 meses)</CardTitle>
					</CardHeader>
					<CardContent>
						<AnalyticsLineChart
							data={data.growthSeries}
							label="Novos usuarios"
							color="hsl(var(--chart-2))"
						/>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Distribuicao por Perfil</CardTitle>
					</CardHeader>
					<CardContent>
						<AnalyticsDonutChart data={data.roleBreakdown} />
					</CardContent>
				</Card>
			</div>
		</>
	);
}

export function UserAnalyticsView() {
	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Analytics de Usuarios"
				description="Crescimento e distribuicao de usuarios."
				icon={<Users className="h-6 w-6" />}
			/>

			<SuspenseBoundary>
				<UserAnalyticsContent />
			</SuspenseBoundary>
		</div>
	);
}
