"use client";

import { useQuery } from "@tanstack/react-query";
import { appointmentsRepository } from "../repositories/appointments.repository";
import { anamnesisKeys } from "./appointment-keys";

export function useAnamnesis(appointmentId: string) {
	return useQuery({
		queryKey: anamnesisKeys.anamnesis(appointmentId),
		queryFn: () => appointmentsRepository.getAnamnesis(appointmentId),
		enabled: !!appointmentId,
		retry: false,
	});
}
