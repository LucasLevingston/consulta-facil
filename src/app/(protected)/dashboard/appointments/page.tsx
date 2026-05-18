"use client";

import { CalendarDays } from "lucide-react";

import AppointmentsDashboard from "@/components/AppointmentDashboard";
import PageHeader from "@/components/custom/page-header";
import {
    useDoctorAppointments,
    usePatientAppointments,
} from "@/hooks/api/use-appointments";
import { QueryBoundary } from "@/providers/query-boundary";
import { useUserStore } from "@/store/useUserStore";

export default function ConsultasPage() {
	const { user } = useUserStore();
	const userId = user?.id ?? "";
	const isAdmin = user?.role === "ADMIN";

	const patientQuery = usePatientAppointments(isAdmin ? "" : userId);
	const doctorQuery = useDoctorAppointments(isAdmin ? userId : "");

	const query = isAdmin ? doctorQuery : patientQuery;
	const appointments = query.data?.content ?? [];

	return (
		<div className="space-y-6">
			<PageHeader
				title="Minhas Consultas"
				description="Acompanhe e gerencie seus agendamentos."
				icon={<CalendarDays className="h-6 w-6" />}
				count={appointments.length}
				countLabel="consulta"
			/>

			<QueryBoundary isLoading={query.isLoading} error={query.error}>
				<AppointmentsDashboard appointments={appointments} />
			</QueryBoundary>
		</div>
	);
}
