"use client";

import { useQuery } from "@tanstack/react-query";
import { appointmentsRepository } from "../repositories/appointments.repository";
import { appointmentKeys } from "./appointment-keys";

export function useProfessionalAppointments(
	professionalId: string,
	page = 0,
	size = 50,
) {
	return useQuery({
		queryKey: appointmentKeys.byProfessional(professionalId),
		queryFn: () =>
			appointmentsRepository.getByProfessional(professionalId, page, size),
		enabled: !!professionalId,
	});
}
