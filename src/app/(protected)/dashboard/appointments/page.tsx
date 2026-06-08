"use client";

import { CalendarDays } from "lucide-react";
import { Suspense } from "react";

import AppointmentsDashboard from "@/components/AppointmentDashboard";
import PageHeader from "@/components/custom/page-header";
import { usePatientAppointments } from "@/hooks/api/appointments/use-patient-appointments";
import { useProfessionalAppointments } from "@/hooks/api/appointments/use-professional-appointments";
import { useMyProfessionalProfile } from "@/hooks/api/doctors/use-my-professional-profile";
import { usePermission } from "@/hooks/use-permission";
import { QueryBoundary } from "@/providers/query-boundary";
import { useUserStore } from "@/store/useUserStore";

export default function AppointmentsPage() {
	const { user } = useUserStore();
	const { can } = usePermission();
	const userId = user?.id ?? "";
	const isProfessional = can("appointment:view:professional");

	const professionalProfileQuery = useMyProfessionalProfile(isProfessional);
	const professionalProfileId = professionalProfileQuery.data?.id ?? "";

	const patientQuery = usePatientAppointments(
		isProfessional ? "" : userId,
		0,
		100,
	);
	const professionalQuery = useProfessionalAppointments(
		isProfessional ? professionalProfileId : "",
		0,
		100,
	);

	const query = isProfessional ? professionalQuery : patientQuery;
	const appointments = query.data?.content ?? [];

	const isLoading = isProfessional
		? professionalProfileQuery.isLoading || professionalQuery.isLoading
		: patientQuery.isLoading;

	return (
		<div className="space-y-6">
			<PageHeader
				title="Minhas Consultas"
				description="Acompanhe e gerencie seus agendamentos."
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
