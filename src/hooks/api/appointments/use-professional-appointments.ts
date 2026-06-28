"use client";

import { useQuery } from "@tanstack/react-query";

import { appointmentsCrudApi } from "@/lib/api/appointments/appointments.api";
import { appointmentKeys } from "./appointment-keys";

export function useProfessionalAppointments(
	professionalId: string,
	page = 0,
	size = 50,
) {
	return useQuery({
		queryKey: appointmentKeys.byProfessional(professionalId),
		queryFn: () =>
			appointmentsCrudApi.getByProfessional(professionalId, page, size),
		enabled: !!professionalId,
	});
}
