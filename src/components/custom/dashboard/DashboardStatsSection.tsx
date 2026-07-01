"use client";

import { CalendarDays, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { AppointmentResponse } from "@/features/appointments";
import { AppointmentsList } from "./appointments-list";
import { StatCard } from "./stat-card";

type Stats = {
	total: number;
	confirmed: number;
	pending: number;
	completed: number;
	canceled: number;
};

interface Props {
	stats: Stats;
	upcoming: AppointmentResponse[];
	isProfessional: boolean;
	onConfirm: (id: string) => void;
	onComplete: (id: string) => void;
}

export function DashboardStatsSection({
	stats,
	upcoming,
	isProfessional,
	onConfirm,
	onComplete,
}: Props) {
	return (
		<>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				<StatCard
					icon={<CalendarDays className="h-5 w-5" />}
					count={stats.total}
					label="Total"
					colorClass="bg-primary/10 text-primary"
				/>
				<StatCard
					icon={<CheckCircle2 className="h-5 w-5" />}
					count={stats.confirmed}
					label="Confirmadas"
					colorClass="bg-green-500/10 text-green-500"
				/>
				<StatCard
					icon={<Clock className="h-5 w-5" />}
					count={stats.pending}
					label="Pendentes"
					colorClass="bg-yellow-500/10 text-yellow-600"
				/>
				<StatCard
					icon={<XCircle className="h-5 w-5" />}
					count={stats.canceled}
					label="Canceladas"
					colorClass="bg-red-500/10 text-red-500"
				/>
			</div>
			<AppointmentsList
				appointments={upcoming}
				isProfessional={isProfessional}
				onConfirm={onConfirm}
				onComplete={onComplete}
			/>
		</>
	);
}
