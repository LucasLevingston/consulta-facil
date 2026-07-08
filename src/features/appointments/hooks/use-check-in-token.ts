"use client";

import { useQuery } from "@tanstack/react-query";
import { appointmentCheckinRepository } from "../repositories/appointment-checkin.repository";
import { appointmentKeys } from "./appointment-keys";

export function useCheckInToken(appointmentId: string) {
	return useQuery({
		queryKey: [...appointmentKeys.detail(appointmentId), "checkin-token"],
		queryFn: () => appointmentCheckinRepository.getCheckInToken(appointmentId),
		enabled: !!appointmentId,
	});
}
