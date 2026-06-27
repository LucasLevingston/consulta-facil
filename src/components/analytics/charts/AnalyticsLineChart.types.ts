import type { TimeSeries } from "@/lib/schemas/analytics/analytics.schema";

export interface AnalyticsLineChartProps {
	data: TimeSeries[];
	dataKey?: string;
	label?: string;
	color?: string;
	valueFormatter?: (v: number) => string;
}
