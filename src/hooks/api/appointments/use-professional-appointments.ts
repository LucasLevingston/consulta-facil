"use client";

import { useQuery } from "@tanstack/react-query";

import { appointmentsApi } from "@/lib/api/appointments.api";
import { appointmentKeys } from "./appointment-keys";

export function useProfessionalAppointments(
	professionalId: string,
	page = 0,
	size = 50,
) {
	return useQuery({
		queryKey: appointmentKeys.byProfessional(professionalId),
		queryFn: () =>
			appointmentsApi.getByProfessional(professionalId, page, size),
		enabled: !!professionalId,
	});
}
