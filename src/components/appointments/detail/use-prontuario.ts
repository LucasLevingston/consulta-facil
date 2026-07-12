"use client";

import { useQuery } from "@tanstack/react-query";
import { anamnesisRepository } from "@/features/appointments";
import { anamnesisKeys } from "./anamnesis-keys";

export function useProntuario(appointmentId: string) {
	return useQuery({
		queryKey: anamnesisKeys.prontuario(appointmentId),
		queryFn: () => anamnesisRepository.getProntuario(appointmentId),
		enabled: !!appointmentId,
		retry: false,
	});
}
