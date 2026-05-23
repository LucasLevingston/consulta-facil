"use client";

import { CalendarDays } from "lucide-react";

import AppointmentsDashboard from "@/components/AppointmentDashboard";
import PageHeader from "@/components/custom/page-header";
import { useMyDoctorProfile } from "@/hooks/api/doctors/use-my-doctor-profile";
import {
	usePatientAppointments,
	useProfessionalAppointments,
} from "@/hooks/api/use-appointments";
import { QueryBoundary } from "@/providers/query-boundary";
import { useUserStore } from "@/store/useUserStore";

export default function AppointmentsPage() {
	const { user } = useUserStore();
	const userId = user?.id ?? "";
	const role = (user?.role ?? "PATIENT") as
		| "PATIENT"
		| "PROFESSIONAL"
		| "ADMIN";
	const isDoctor = role === "PROFESSIONAL" || role === "ADMIN";

	const doctorProfileQuery = useMyDoctorProfile(isDoctor);
	const professionalProfileId = doctorProfileQuery.data?.id ?? "";

	const patientQuery = usePatientAppointments(isDoctor ? "" : userId, 0, 200);
	const doctorQuery = useProfessionalAppointments(
		isDoctor ? professionalProfileId : "",
		0,
		200,
	);

	const query = isDoctor ? doctorQuery : patientQuery;
	const appointments = query.data?.content ?? [];

	const isLoading = isDoctor
		? doctorProfileQuery.isLoading || doctorQuery.isLoading
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
				<AppointmentsDashboard appointments={appointments} userRole={role} />
			</QueryBoundary>
		</div>
	);
}
