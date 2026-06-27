"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { AnalyticsBarChartProps } from "./AnalyticsBarChart.types";

export function AnalyticsBarChart({
	data,
	color = "hsl(var(--chart-1))",
}: AnalyticsBarChartProps) {
	const config: ChartConfig = {
		count: { label: "Quantidade", color },
	};

	return (
		<ChartContainer config={config} className="h-48 w-full">
			<BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
					width={40}
				/>
				<ChartTooltip content={<ChartTooltipContent />} />
				<Bar dataKey="count" fill={color} radius={4} />
			</BarChart>
		</ChartContainer>
	);
}
