"use client";

import { useMemo } from "react";
import {
	useCompleteAppointment,
	useConfirmAppointment,
	usePatientAppointments,
	useProfessionalAppointments,
} from "@/components/appointments/hooks";
import { useMyProfessionalProfile } from "@/components/professionals/hooks";
import { useUserStore } from "@/features/auth";

export function useDashboardData(isProfessional: boolean, isPatient: boolean) {
	const { user } = useUserStore();
	const { data: professionalProfile } =
		useMyProfessionalProfile(isProfessional);
	const professionalId = professionalProfile?.id ?? "";

	const patientQuery = usePatientAppointments(
		isPatient ? (user?.id ?? "") : "",
	);
	const professionalQuery = useProfessionalAppointments(
		isProfessional ? professionalId : "",
	);
	const { mutateAsync: confirm } = useConfirmAppointment();
	const { mutateAsync: complete } = useCompleteAppointment();

	const appointments = isProfessional
		? (professionalQuery.data?.content ?? [])
		: (patientQuery.data?.content ?? []);

	const stats = useMemo(
		() => ({
			total: appointments.length,
			confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
			pending: appointments.filter((a) => a.status === "PENDING").length,
			completed: appointments.filter((a) => a.status === "COMPLETED").length,
			canceled: appointments.filter((a) => a.status === "CANCELED").length,
		}),
		[appointments],
	);

	const upcoming = useMemo(() => {
		const now = new Date();
		return appointments
			.filter(
				(a) =>
					(a.status === "CONFIRMED" || a.status === "PENDING") &&
					new Date(a.scheduledAt) >= now,
			)
			.sort(
				(a, b) =>
					new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
			)
			.slice(0, isProfessional ? 5 : 3);
	}, [appointments, isProfessional]);

	return { user, stats, upcoming, confirm, complete };
}
