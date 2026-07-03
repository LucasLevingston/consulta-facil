"use client";

import { useQuery } from "@tanstack/react-query";
import { appointmentsRepository } from "../repositories/appointments.repository";
import { appointmentKeys } from "./appointment-keys";

export function useAppointment(id: string) {
	return useQuery({
		queryKey: appointmentKeys.detail(id),
		queryFn: () => appointmentsRepository.getById(id),
		enabled: !!id,
	});
}
