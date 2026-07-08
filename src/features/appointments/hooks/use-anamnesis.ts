"use client";

import { useQuery } from "@tanstack/react-query";
import { anamnesisRepository } from "../repositories/anamnesis.repository";
import { anamnesisKeys } from "./anamnesis-keys";

export function useAnamnesis(appointmentId: string) {
	return useQuery({
		queryKey: anamnesisKeys.anamnesis(appointmentId),
		queryFn: () => anamnesisRepository.getAnamnesis(appointmentId),
		enabled: !!appointmentId,
		retry: false,
	});
}
