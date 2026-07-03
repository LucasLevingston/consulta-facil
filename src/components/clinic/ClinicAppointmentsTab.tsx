"use client";

import { CalendarDays, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useClinicAppointments } from "@/features/appointments";
import { ALL } from "@/utils/constants/filter-sentinels";
import { ClinicAppointmentCard } from "./ClinicAppointmentCard";
import { ClinicAppointmentsFilterBar } from "./ClinicAppointmentsFilterBar";
import type { ClinicAppointmentsTabProps } from "./ClinicAppointmentsTab.types";

export function ClinicAppointmentsTab({
	clinic,
	isManager,
	myProfessionalProfileId,
}: ClinicAppointmentsTabProps) {
	const [filterProfessionalId, setFilterProfessionalId] = useState(ALL);
	const [filterStatus, setFilterStatus] = useState(ALL);

	const targetIds: string[] = isManager
		? (clinic.members ?? []).map((m) => m.professionalProfileId)
		: myProfessionalProfileId
			? [myProfessionalProfileId]
			: [];

	const { appointments, isLoading } = useClinicAppointments(targetIds);

	const filtered = useMemo(() => {
		let list = appointments;
		if (filterProfessionalId !== ALL)
			list = list.filter((a) => a.professionalId === filterProfessionalId);
		if (filterStatus !== ALL)
			list = list.filter((a) => a.status === filterStatus);
		return list.sort(
			(a, b) =>
				new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
		);
	}, [appointments, filterProfessionalId, filterStatus]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-16">
				<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<ClinicAppointmentsFilterBar
				isManager={isManager}
				members={clinic.members ?? []}
				filterProfessionalId={filterProfessionalId}
				filterStatus={filterStatus}
				filteredCount={filtered.length}
				onProfessionalChange={setFilterProfessionalId}
				onStatusChange={setFilterStatus}
			/>
			{filtered.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
						<CalendarDays className="h-6 w-6 text-muted-foreground" />
					</div>
					<h3 className="mt-4 text-sm font-semibold">
						Nenhuma consulta encontrada
					</h3>
					<p className="mt-2 text-sm text-muted-foreground">
						Ajuste os filtros ou aguarde novos agendamentos.
					</p>
				</div>
			) : (
				<div className="space-y-2">
					{filtered.map((appt) => (
						<ClinicAppointmentCard key={appt.id} appt={appt} />
					))}
				</div>
			)}
		</div>
	);
}
