"use client";

import { AnalyticsBarChart } from "@/components/analytics/charts/AnalyticsBarChart";
import { AnalyticsDonutChart } from "@/components/analytics/charts/AnalyticsDonutChart";
import { AnalyticsLineChart } from "@/components/analytics/charts/AnalyticsLineChart";
import { KpiCard } from "@/components/analytics/KpiCard";
import { formatBRL } from "@/utils/format-brl";
import { ChartCard } from "./ChartCard";
import type { ProfessionalAnalyticsContentProps } from "./ProfessionalAnalyticsContent.types";
import {
	MODALITY_LABELS,
	RATING_STARS,
	WEEKDAY_LABELS,
} from "./professional-analytics.constants";
import { TopServicesTable } from "./TopServicesTable";
import { toBreakdown } from "./to-breakdown";
import { toProfessionalKpis } from "./to-professional-kpis";
import { toRevenueSeries } from "./to-revenue-series";

export function ProfessionalAnalyticsContent({
	data,
}: ProfessionalAnalyticsContentProps) {
	const weekdays = toBreakdown(
		data.appointments.byWeekday.map((d) => ({
			label: WEEKDAY_LABELS[d.day] ?? d.day,
			count: d.count,
		})),
	);
	const modalities = toBreakdown(
		Object.entries(data.appointments.byModality).map(([key, count]) => ({
			label: MODALITY_LABELS[key] ?? key,
			count,
		})),
	);
	const ratings = toBreakdown(
		RATING_STARS.map((stars) => ({
			label: `${stars} ★`,
			count: data.ratings.distribution[stars] ?? 0,
		})),
	);

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{toProfessionalKpis(data).map((kpi) => (
					<KpiCard key={kpi.label} kpi={kpi} />
				))}
			</div>

			<ChartCard title="Receita por mês">
				<AnalyticsLineChart
					data={toRevenueSeries(data.revenue.byMonth)}
					label="Receita"
					valueFormatter={formatBRL}
				/>
			</ChartCard>

			<div className="grid gap-4 md:grid-cols-2">
				<ChartCard title="Consultas por dia da semana">
					<AnalyticsBarChart data={weekdays} />
				</ChartCard>
				<ChartCard title="Presencial x Online">
					<AnalyticsDonutChart data={modalities} />
				</ChartCard>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<ChartCard title="Distribuição das avaliações">
					<AnalyticsBarChart data={ratings} color="hsl(var(--chart-4))" />
				</ChartCard>
				<ChartCard title="Serviços mais procurados">
					<TopServicesTable services={data.topServices} />
				</ChartCard>
			</div>
		</div>
	);
}
