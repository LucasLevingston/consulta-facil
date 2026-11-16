"use client";

import { BarChart3 } from "lucide-react";
import { useState, useTransition } from "react";
import {
	AnalyticsPeriodSelect,
	ProfessionalAnalyticsContent,
} from "@/components/analytics/professional-analytics";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import type { AnalyticsPeriod } from "@/features/analytics";
import { useProfessionalAnalytics } from "./use-professional-analytics";

function ProfessionalAnalyticsData({ period }: { period: AnalyticsPeriod }) {
	const { data } = useProfessionalAnalytics(period);
	return <ProfessionalAnalyticsContent data={data} />;
}

export function ProfessionalAnalyticsView() {
	const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
	// Keep the current charts on screen while the next period loads instead of
	// falling back to the skeleton on every switch.
	const [isSwitching, startTransition] = useTransition();

	return (
		<div className="space-y-6">
			<PageHeader
				title="Analytics"
				description="Receita, consultas, avaliações e serviços mais procurados."
				icon={<BarChart3 className="h-6 w-6" />}
			/>
			<AnalyticsPeriodSelect
				value={period}
				disabled={isSwitching}
				onChange={(next) => startTransition(() => setPeriod(next))}
			/>
			<SuspenseBoundary>
				<ProfessionalAnalyticsData period={period} />
			</SuspenseBoundary>
		</div>
	);
}
