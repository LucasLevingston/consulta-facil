"use client";

import { useQuery } from "@tanstack/react-query";

import { appointmentsCrudApi } from "@/lib/api/appointments/appointments.api";
import { appointmentKeys } from "./appointment-keys";

export function usePatientAppointments(userId: string, page = 0, size = 50) {
	return useQuery({
		queryKey: appointmentKeys.byPatient(userId),
		queryFn: () => appointmentsCrudApi.getByPatient(userId, page, size),
		enabled: !!userId,
	});
}
