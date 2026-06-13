"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { Breakdown } from "@/lib/schemas/analytics/analytics.schema";

const COLORS = [
	"hsl(var(--chart-1))",
	"hsl(var(--chart-2))",
	"hsl(var(--chart-3))",
	"hsl(var(--chart-4))",
	"hsl(var(--chart-5))",
];

interface AnalyticsDonutChartProps {
	data: Breakdown[];
}

export function AnalyticsDonutChart({ data }: AnalyticsDonutChartProps) {
	const config: ChartConfig = Object.fromEntries(
		data.map((d, i) => [
			d.label,
			{ label: d.label, color: COLORS[i % COLORS.length] },
		]),
	);

	return (
		<ChartContainer config={config} className="h-48 w-full">
			<PieChart>
				<Pie
					data={data}
					dataKey="count"
					nameKey="label"
					cx="50%"
					cy="50%"
					innerRadius={45}
					outerRadius={75}
				>
					{data.map((entry, i) => (
						<Cell key={entry.label} fill={COLORS[i % COLORS.length]} />
					))}
				</Pie>
				<ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
			</PieChart>
		</ChartContainer>
	);
}
