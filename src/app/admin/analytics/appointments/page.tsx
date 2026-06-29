"use client";

import { Calendar } from "lucide-react";
import { AnalyticsBarChart } from "@/components/analytics/charts/AnalyticsBarChart";
import { AnalyticsDonutChart } from "@/components/analytics/charts/AnalyticsDonutChart";
import { AnalyticsLineChart } from "@/components/analytics/charts/AnalyticsLineChart";
import { KpiCard } from "@/components/analytics/KpiCard";
import PageHeader from "@/components/custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppointmentAnalytics } from "@/features/analytics";

export default function AppointmentAnalyticsPage() {
	const { data, isLoading } = useAppointmentAnalytics();

	if (isLoading) {
		return (
			<div className="p-6">
				<p className="text-sm text-muted-foreground">Carregando...</p>
			</div>
		);
	}

	if (!data) return null;

	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Analytics de Consultas"
				description="Volume, status e modalidade das consultas."
				icon={<Calendar className="h-6 w-6" />}
			/>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
				{data.kpis.map((kpi) => (
					<KpiCard key={kpi.label} kpi={kpi} />
				))}
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">
						Consultas por Mes (12 meses)
					</CardTitle>
				</CardHeader>
				<CardContent>
					<AnalyticsLineChart
						data={data.appointmentSeries}
						label="Consultas"
						color="hsl(var(--chart-3))"
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
							color="hsl(var(--chart-3))"
						/>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Por Modalidade</CardTitle>
					</CardHeader>
					<CardContent>
						<AnalyticsDonutChart data={data.modalityBreakdown} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
