"use client";

import { useQuery } from "@tanstack/react-query";

import { appointmentsCrudApi } from "@/lib/api/appointments/appointments.api";
import { appointmentKeys } from "./appointment-keys";

export function useAllAdminAppointments(page = 0, size = 100) {
	return useQuery({
		queryKey: appointmentKeys.adminAll(page, size),
		queryFn: () => appointmentsCrudApi.getAll(page, size),
	});
}
