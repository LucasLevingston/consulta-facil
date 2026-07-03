"use client";

import { format, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppointmentResponse } from "@/features/appointments";
import { MonthBar } from "./MonthBar";

interface Props {
	appointments: AppointmentResponse[];
}

export function FinancialMonthlyChart({ appointments }: Props) {
	const monthlyData = useMemo(() => {
		const now = new Date();
		return Array.from({ length: 6 }, (_, i) => {
			const month = subMonths(startOfMonth(now), 5 - i);
			const label = format(month, "MMM", { locale: ptBR });
			const revenue = appointments
				.filter((a) => {
					if (a.paymentStatus !== "PAID") return false;
					const d = new Date(a.scheduledAt);
					return (
						d.getFullYear() === month.getFullYear() &&
						d.getMonth() === month.getMonth()
					);
				})
				.reduce((sum, a) => sum + (a.paymentAmount ?? 0), 0);
			return { label, revenue };
		});
	}, [appointments]);

	const totalRevenue = appointments
		.filter((a) => a.paymentStatus === "PAID")
		.reduce((sum, a) => sum + (a.paymentAmount ?? 0), 0);
	const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1);

	return (
		<Card className="border-border bg-card">
			<CardHeader className="pb-2">
				<CardTitle className="text-base font-semibold">
					Receita mensal — últimos 6 meses
				</CardTitle>
			</CardHeader>
			<CardContent>
				{totalRevenue === 0 ? (
					<div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
						<AlertCircle className="h-8 w-8 text-muted-foreground/40" />
						<p className="text-sm text-muted-foreground">
							Nenhum pagamento registrado ainda.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-6 gap-2">
						{monthlyData.map((m) => (
							<MonthBar
								key={m.label}
								label={m.label}
								value={m.revenue}
								max={maxRevenue}
							/>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
