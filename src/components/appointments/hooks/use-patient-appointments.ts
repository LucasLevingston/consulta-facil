"use client";

import { useQuery } from "@tanstack/react-query";
import { appointmentsRepository } from "@/features/appointments";
import { appointmentKeys } from "./appointment-keys";

export function usePatientAppointments(userId: string, page = 0, size = 50) {
	return useQuery({
		queryKey: appointmentKeys.byPatient(userId),
		queryFn: () => appointmentsRepository.getByPatient(userId, page, size),
		enabled: !!userId,
	});
}
