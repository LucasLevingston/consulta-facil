"use client";

import { useQuery } from "@tanstack/react-query";
import { appointmentsRepository } from "../repositories/appointments.repository";
import { appointmentKeys } from "./appointment-keys";

export function usePatientAppointments(userId: string, page = 0, size = 50) {
	return useQuery({
		queryKey: appointmentKeys.byPatient(userId),
		queryFn: () => appointmentsRepository.getByPatient(userId, page, size),
		enabled: !!userId,
	});
}
