import type { TimeSeries } from "@/features/analytics";

export interface AnalyticsLineChartProps {
	data: TimeSeries[];
	dataKey?: string;
	label?: string;
	color?: string;
	valueFormatter?: (v: number) => string;
}
