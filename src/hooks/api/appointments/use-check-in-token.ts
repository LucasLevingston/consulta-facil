"use client";

import { useQuery } from "@tanstack/react-query";

import { appointmentCheckinApi } from "@/lib/api/appointments/appointment-checkin.api";
import { appointmentKeys } from "./appointment-keys";

export function useCheckInToken(appointmentId: string) {
	return useQuery({
		queryKey: [...appointmentKeys.detail(appointmentId), "checkin-token"],
		queryFn: () => appointmentCheckinApi.getCheckInToken(appointmentId),
		enabled: !!appointmentId,
	});
}
