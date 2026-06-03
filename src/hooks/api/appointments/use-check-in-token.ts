"use client";

import { useQuery } from "@tanstack/react-query";

import { appointmentsApi } from "@/lib/api/appointments.api";
import { appointmentKeys } from "./appointment-keys";

export function useCheckInToken(appointmentId: string) {
	return useQuery({
		queryKey: [...appointmentKeys.detail(appointmentId), "checkin-token"],
		queryFn: () => appointmentsApi.getCheckInToken(appointmentId),
		enabled: !!appointmentId,
	});
}
