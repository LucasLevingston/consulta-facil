"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Kpi } from "@/features/analytics";
import { formatBRL } from "@/utils/format-brl";
import type { KpiCardProps } from "./KpiCard.types";

export function KpiCard({ kpi }: KpiCardProps) {
	function formatValue(k: Kpi): string {
		if (k.unit === "BRL") return formatBRL(k.value);
		if (k.unit === "%") return `${k.value.toFixed(1)}%`;
		return k.value.toLocaleString("pt-BR");
	}

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
