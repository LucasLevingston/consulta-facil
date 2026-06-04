"use client";

import { useQueries } from "@tanstack/react-query";
import { CalendarDays, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { appointmentKeys } from "@/hooks/api/appointments/appointment-keys";
import { appointmentsApi } from "@/lib/api/appointments.api";
import type { AppointmentResponse } from "@/lib/schemas/appointment.schema";
import type { ClinicResponse } from "@/lib/schemas/clinic.schema";
import { STATUS_CLASS } from "@/utils/constants/appointment-status-class";
import { STATUS_LABEL } from "@/utils/constants/appointment-status-label";
import { ALL } from "@/utils/constants/filter-sentinels";

interface Props {
	clinic: ClinicResponse;
	isManager: boolean;
	myProfessionalProfileId?: string;
}

export function ClinicAppointmentsTab({
	clinic,
	isManager,
	myProfessionalProfileId,
}: Props) {
	const [filterProfessionalId, setFilterProfessionalId] = useState(ALL);
	const [filterStatus, setFilterStatus] = useState(ALL);

	const targetIds: string[] = isManager
		? (clinic.members ?? []).map((m) => m.professionalProfileId)
		: myProfessionalProfileId
			? [myProfessionalProfileId]
			: [];

	const results = useQueries({
		queries: targetIds.map((id) => ({
			queryKey: appointmentKeys.byProfessional(id),
			queryFn: () => appointmentsApi.getByProfessional(id, 0, 100),
		})),
	});

	const isLoading = results.some((r) => r.isLoading);

	const appointments: AppointmentResponse[] = useMemo(
		() => results.flatMap((r) => r.data?.content ?? []),
		[results],
	);

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
			{/* Filters */}
			<div className="flex flex-wrap items-center gap-2">
				{isManager && (
					<Select
						value={filterProfessionalId}
						onValueChange={setFilterProfessionalId}
					>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="Todos os profissionais" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL}>Todos os profissionais</SelectItem>
							{(clinic.members ?? []).map((m) => (
								<SelectItem
									key={m.professionalProfileId}
									value={m.professionalProfileId}
								>
									{m.professionalName ?? m.specialty}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}

				<Select value={filterStatus} onValueChange={setFilterStatus}>
					<SelectTrigger className="w-[160px]">
						<SelectValue placeholder="Todos os status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>Todos os status</SelectItem>
						{Object.entries(STATUS_LABEL).map(([key, label]) => (
							<SelectItem key={key} value={key}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<p className="ml-auto text-sm text-muted-foreground">
					{filtered.length} consulta{filtered.length !== 1 ? "s" : ""}
				</p>
			</div>

			{/* Appointment list */}
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
						<Card key={appt.id} className="transition-shadow hover:shadow-sm">
							<CardContent className="flex flex-wrap items-center gap-3 p-4">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 flex-wrap">
										<p className="text-sm font-semibold truncate">
											{appt.patientName ?? "Paciente"}
										</p>
										<Badge
											variant="outline"
											className={STATUS_CLASS[appt.status]}
										>
											{STATUS_LABEL[appt.status]}
										</Badge>
									</div>
									<p className="mt-0.5 text-xs text-muted-foreground">
										{appt.professionalName ?? "—"} · {appt.specialty ?? "—"}
									</p>
								</div>
								<div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
									<CalendarDays className="h-3.5 w-3.5" />
									<span>
										{new Date(appt.scheduledAt).toLocaleDateString("pt-BR", {
											day: "2-digit",
											month: "short",
											year: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
