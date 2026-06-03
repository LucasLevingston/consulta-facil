"use client";

import { useQuery } from "@tanstack/react-query";

import { appointmentsApi } from "@/lib/api/appointments.api";
import { appointmentKeys } from "./appointment-keys";

export function useAppointment(id: string) {
	return useQuery({
		queryKey: appointmentKeys.detail(id),
		queryFn: () => appointmentsApi.getById(id),
		enabled: !!id,
	});
}
