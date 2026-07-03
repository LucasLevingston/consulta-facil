"use client";

import { useQuery } from "@tanstack/react-query";
import { appointmentsRepository } from "../repositories/appointments.repository";
import { anamnesisKeys } from "./appointment-keys";

export function useProntuario(appointmentId: string) {
	return useQuery({
		queryKey: anamnesisKeys.prontuario(appointmentId),
		queryFn: () => appointmentsRepository.getProntuario(appointmentId),
		enabled: !!appointmentId,
		retry: false,
	});
}
