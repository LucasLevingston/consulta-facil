"use client";

import { CalendarDays } from "lucide-react";
import { useState } from "react";

import AppointmentsDashboard from "@/components/AppointmentDashboard";
import PageHeader from "@/components/custom/page-header";
import {
	useDoctorAppointments,
	usePatientAppointments,
} from "@/hooks/api/use-appointments";
import { QueryBoundary } from "@/providers/query-boundary";
import { useUserStore } from "@/store/useUserStore";

const PAGE_SIZE = 20;

export default function ConsultasPage() {
	const { user } = useUserStore();
	const userId = user?.id ?? "";
	const isDoctor = user?.role === "DOCTOR" || user?.role === "ADMIN";
	const [page, setPage] = useState(0);

	const patientQuery = usePatientAppointments(isDoctor ? "" : userId, page, PAGE_SIZE);
	const doctorQuery = useDoctorAppointments(isDoctor ? userId : "", page, PAGE_SIZE);

	const query = isDoctor ? doctorQuery : patientQuery;
	const appointments = query.data?.content ?? [];
	const totalPages = query.data?.totalPages ?? 1;

	return (
		<div className="space-y-6">
			<PageHeader
				title="Minhas Consultas"
				description="Acompanhe e gerencie seus agendamentos."
				icon={<CalendarDays className="h-6 w-6" />}
				count={query.data?.totalElements}
				countLabel="consulta"
			/>

			<QueryBoundary isLoading={query.isLoading} error={query.error}>
				<AppointmentsDashboard
					appointments={appointments}
					totalPages={totalPages}
					currentPage={page}
					onPageChange={setPage}
				/>
			</QueryBoundary>
		</div>
	);
}
