"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { appointmentsRepository } from "../repositories/appointments.repository";
import { appointmentKeys } from "./appointment-keys";

export function useAppointment(id: string) {
	return useSuspenseQuery({
		queryKey: appointmentKeys.detail(id),
		queryFn: () => appointmentsRepository.getById(id),
	});
}
