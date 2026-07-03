"use client";

import { CalendarCheck, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import type { AppointmentResponse } from "@/features/appointments";
import { formatBRL } from "@/utils/format-brl";
import { SummaryCard } from "./SummaryCard";

interface Props {
	appointments: AppointmentResponse[];
}

export function FinancialSummaryGrid({ appointments }: Props) {
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

	return (
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
	);
}
