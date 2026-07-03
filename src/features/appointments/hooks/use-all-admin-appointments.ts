"use client";

import { useQuery } from "@tanstack/react-query";
import { appointmentsRepository } from "../repositories/appointments.repository";
import { appointmentKeys } from "./appointment-keys";

export function useAllAdminAppointments(page = 0, size = 100) {
	return useQuery({
		queryKey: appointmentKeys.adminAll(page, size),
		queryFn: () => appointmentsRepository.getAll(page, size),
	});
}
