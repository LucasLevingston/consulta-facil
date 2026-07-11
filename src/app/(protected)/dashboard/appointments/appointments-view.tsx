"use client";

import { CalendarDays } from "lucide-react";
import { Suspense } from "react";

import AppointmentsDashboard from "@/components/AppointmentDashboard";
import { usePermission } from "@/components/auth/hooks";
import PageHeader from "@/components/custom/page-header";
import { useMyProfessionalProfile } from "@/components/professionals/hooks";
import {
	useAllAdminAppointments,
	usePatientAppointments,
	useProfessionalAppointments,
} from "@/features/appointments";
import { useUserStore } from "@/features/auth";
import { QueryBoundary } from "@/providers/query-boundary";

export function AppointmentsView() {
	const { user } = useUserStore();
	const { can } = usePermission();
	const userId = user?.id ?? "";
	const isProfessional = can("professional:manage");
	const isAdmin = can("admin:access");

	const professionalProfileQuery = useMyProfessionalProfile(isProfessional);
	const professionalProfileId = professionalProfileQuery.data?.id ?? "";

	const patientQuery = usePatientAppointments(
		!isProfessional && !isAdmin ? userId : "",
		0,
		100,
	);
	const professionalQuery = useProfessionalAppointments(
		isProfessional ? professionalProfileId : "",
		0,
		100,
	);
	const adminQuery = useAllAdminAppointments(0, 100);

	const query = isAdmin
		? adminQuery
		: isProfessional
			? professionalQuery
			: patientQuery;
	const appointments = query.data?.content ?? [];

	const isLoading = isAdmin
		? adminQuery.isLoading
		: isProfessional
			? professionalProfileQuery.isLoading || professionalQuery.isLoading
			: patientQuery.isLoading;

	return (
		<div className="space-y-6">
			<PageHeader
				title={isAdmin ? "Consultas" : "Minhas Consultas"}
				description={
					isAdmin
						? "Todas as consultas do sistema."
						: "Acompanhe e gerencie seus agendamentos."
				}
				icon={<CalendarDays className="h-6 w-6" />}
				count={query.data?.totalElements}
				countLabel="consulta"
			/>

			<QueryBoundary isLoading={isLoading} error={query.error}>
				<Suspense>
					<AppointmentsDashboard appointments={appointments} />
				</Suspense>
			</QueryBoundary>
		</div>
	);
}
