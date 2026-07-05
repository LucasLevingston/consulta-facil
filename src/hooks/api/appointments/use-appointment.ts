"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { appointmentsCrudApi } from "@/lib/api/appointments/appointments.api";
import { appointmentKeys } from "./appointment-keys";

export function useAppointment(id: string) {
	return useSuspenseQuery({
		queryKey: appointmentKeys.detail(id),
		queryFn: () => appointmentsCrudApi.getById(id),
	});
}
