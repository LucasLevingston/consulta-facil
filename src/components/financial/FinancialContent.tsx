"use client";

import { format, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	AlertCircle,
	CalendarCheck,
	CheckCircle2,
	Clock,
	TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
import { FeeCalculator } from "@/components/custom/fees/FeeCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";
import { formatBRL } from "@/utils/format-brl";
import { MonthBar } from "./MonthBar";
import { SummaryCard } from "./SummaryCard";

export function FinancialContent({
	appointments,
}: {
	appointments: AppointmentResponse[];
}) {
	const stats = useMemo(() => {
		const paid = appointments.filter((a) => a.paymentStatus === "PAID");
		const pending = appointments.filter(
			(a) => a.paymentStatus === "PENDING_PAYMENT",
		);
		const completed = appointments.filter((a) => a.status === "COMPLETED");

		const totalRevenue = paid.reduce(
			(sum, a) => sum + (a.paymentAmount ?? 0),
			0,
		);
		const pendingRevenue = pending.reduce(
			(sum, a) => sum + (a.paymentAmount ?? 0),
			0,
		);
		const avgTicket = paid.length > 0 ? totalRevenue / paid.length : 0;

		return {
			totalRevenue,
			pendingRevenue,
			avgTicket,
			paidCount: paid.length,
			pendingCount: pending.length,
			completedCount: completed.length,
		};
	}, [appointments]);

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

	const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1);

	const recentPaid = useMemo(
		() =>
			appointments
				.filter((a) => a.paymentStatus === "PAID")
				.sort(
					(a, b) =>
						new Date(b.scheduledAt).getTime() -
						new Date(a.scheduledAt).getTime(),
				)
				.slice(0, 5),
		[appointments],
	);

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				<SummaryCard
					icon={<TrendingUp className="h-5 w-5" />}
					label="Receita total"
					value={formatBRL(stats.totalRevenue)}
					sub={`${stats.paidCount} consulta${stats.paidCount !== 1 ? "s" : ""} paga${stats.paidCount !== 1 ? "s" : ""}`}
					colorClass="bg-green-500/10 text-green-600"
				/>
				<SummaryCard
					icon={<CalendarCheck className="h-5 w-5" />}
					label="Ticket médio"
					value={formatBRL(stats.avgTicket)}
					sub="por consulta paga"
					colorClass="bg-primary/10 text-primary"
				/>
				<SummaryCard
					icon={<Clock className="h-5 w-5" />}
					label="Pendente"
					value={formatBRL(stats.pendingRevenue)}
					sub={`${stats.pendingCount} aguardando pagamento`}
					colorClass="bg-yellow-500/10 text-yellow-600"
				/>
				<SummaryCard
					icon={<CheckCircle2 className="h-5 w-5" />}
					label="Concluídas"
					value={String(stats.completedCount)}
					sub="consultas realizadas"
					colorClass="bg-blue-500/10 text-blue-600"
				/>
			</div>

			<Card className="border-border bg-card">
				<CardHeader className="pb-2">
					<CardTitle className="text-base font-semibold">
						Receita mensal — últimos 6 meses
					</CardTitle>
				</CardHeader>
				<CardContent>
					{stats.totalRevenue === 0 ? (
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

			<Card className="border-border bg-card">
				<CardHeader className="pb-2">
					<CardTitle className="text-base font-semibold">
						Últimas consultas pagas
					</CardTitle>
				</CardHeader>
				<CardContent>
					{recentPaid.length === 0 ? (
						<p className="py-6 text-center text-sm text-muted-foreground">
							Nenhuma consulta paga encontrada.
						</p>
					) : (
						<div className="space-y-3">
							{recentPaid.map((a) => (
								<div
									key={a.id}
									className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-4 py-3"
								>
									<div>
										<p className="text-sm font-medium text-foreground">
											{a.patientName ?? "Paciente"}
										</p>
										<p className="text-xs text-muted-foreground">
											{format(
												new Date(a.scheduledAt),
												"dd/MM/yyyy 'às' HH:mm",
												{ locale: ptBR },
											)}
										</p>
									</div>
									<div className="flex items-center gap-3">
										{a.specialty && (
											<Badge
												variant="secondary"
												className="hidden text-xs sm:inline-flex"
											>
												{SPECIALTY_LABELS[a.specialty] ?? a.specialty}
											</Badge>
										)}
										<span className="font-semibold text-green-600 text-sm">
											{formatBRL(a.paymentAmount ?? 0)}
										</span>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			<FeeCalculator />
		</div>
	);
}
