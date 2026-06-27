"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { AnalyticsLineChartProps } from "./AnalyticsLineChart.types";

export function AnalyticsLineChart({
	data,
	dataKey = "value",
	label = "Valor",
	color = "hsl(var(--chart-1))",
	valueFormatter,
}: AnalyticsLineChartProps) {
	const config: ChartConfig = {
		[dataKey]: { label, color },
	};

	return (
		<ChartContainer config={config} className="h-64 w-full">
			<LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
				<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
				<XAxis
					dataKey="label"
					tick={{ fontSize: 11 }}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					tick={{ fontSize: 11 }}
					tickLine={false}
					axisLine={false}
					tickFormatter={valueFormatter}
					width={60}
				/>
				<ChartTooltip
					content={
						<ChartTooltipContent
							formatter={
								valueFormatter
									? (val) => valueFormatter(Number(val))
									: undefined
							}
						/>
					}
				/>
				<Line
					type="monotone"
					dataKey={dataKey}
					stroke={color}
					strokeWidth={2}
					dot={false}
				/>
			</LineChart>
		</ChartContainer>
	);
}
