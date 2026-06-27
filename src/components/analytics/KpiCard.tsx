"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Kpi } from "@/lib/schemas/analytics/analytics.schema";
import type { KpiCardProps } from "./KpiCard.types";

const brl = (n: number) =>
	new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
		n,
	);

function formatValue(kpi: Kpi): string {
	if (kpi.unit === "BRL") return brl(kpi.value);
	if (kpi.unit === "%") return `${kpi.value.toFixed(1)}%`;
	return kpi.value.toLocaleString("pt-BR");
}

export function KpiCard({ kpi }: KpiCardProps) {
	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{kpi.label}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-2xl font-bold">{formatValue(kpi)}</p>
			</CardContent>
		</Card>
	);
}
