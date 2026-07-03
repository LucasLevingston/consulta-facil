"use client";

import { Search } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Input } from "@/components/ui/input";
import type { AppointmentStatus } from "@/features/appointments";

interface Props {
	counts: {
		total: number;
		confirmed: number;
		pending: number;
		canceled: number;
		completed: number;
	};
	activeStatus: AppointmentStatus | null;
	search: string;
	onStatusChange: (status: AppointmentStatus | null) => void;
	onSearchChange: (q: string) => void;
}

export function AppointmentDashboardFilters({
	counts,
	activeStatus,
	search,
	onStatusChange,
	onSearchChange,
}: Props) {
	return (
		<>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
				<StatCard
					count={counts.total}
					label="Todas"
					icon=""
					onClick={() => onStatusChange(null)}
					onActive={activeStatus === null}
				/>
				<StatCard
					type="CONFIRMED"
					count={counts.confirmed}
					label="Confirmadas"
					icon=""
					onClick={() => onStatusChange("CONFIRMED")}
					onActive={activeStatus === "CONFIRMED"}
				/>
				<StatCard
					type="PENDING"
					count={counts.pending}
					label="Pendentes"
					icon=""
					onClick={() => onStatusChange("PENDING")}
					onActive={activeStatus === "PENDING"}
				/>
				<StatCard
					type="CANCELED"
					count={counts.canceled}
					label="Canceladas"
					icon=""
					onClick={() => onStatusChange("CANCELED")}
					onActive={activeStatus === "CANCELED"}
				/>
				<StatCard
					type="COMPLETED"
					count={counts.completed}
					label="Concluídas"
					icon=""
					onClick={() => onStatusChange("COMPLETED")}
					onActive={activeStatus === "COMPLETED"}
				/>
			</div>
			<div className="relative">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Buscar por paciente, profissional, especialidade ou motivo..."
					value={search}
					onChange={(e) => onSearchChange(e.target.value || "")}
					className="pl-9 rounded-xl"
				/>
			</div>
		</>
	);
}
