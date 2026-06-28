"use client";

import { useQuery } from "@tanstack/react-query";

import { appointmentsCrudApi } from "@/lib/api/appointments/appointments.api";
import { appointmentKeys } from "./appointment-keys";

export function useAppointment(id: string) {
	return useQuery({
		queryKey: appointmentKeys.detail(id),
		queryFn: () => appointmentsCrudApi.getById(id),
		enabled: !!id,
	});
}
