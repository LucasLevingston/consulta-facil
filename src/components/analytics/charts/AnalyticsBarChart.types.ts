import type { Breakdown } from "@/lib/schemas/analytics/analytics.schema";

export interface AnalyticsBarChartProps {
	data: Breakdown[];
	color?: string;
}
