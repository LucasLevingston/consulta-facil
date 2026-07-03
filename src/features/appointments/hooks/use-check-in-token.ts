"use client";

import { useQuery } from "@tanstack/react-query";
import { appointmentsRepository } from "../repositories/appointments.repository";
import { appointmentKeys } from "./appointment-keys";

export function useCheckInToken(appointmentId: string) {
	return useQuery({
		queryKey: [...appointmentKeys.detail(appointmentId), "checkin-token"],
		queryFn: () => appointmentsRepository.getCheckInToken(appointmentId),
		enabled: !!appointmentId,
	});
}
