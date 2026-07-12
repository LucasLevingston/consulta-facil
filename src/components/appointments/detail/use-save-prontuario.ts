"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { anamnesisRepository } from "@/features/appointments";
import type { ProntuarioInput } from "@/lib/schemas/anamnesis/prontuario.schema";
import { anamnesisKeys } from "./anamnesis-keys";

export function useSaveProntuario(appointmentId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: ProntuarioInput) =>
			anamnesisRepository.saveProntuario(appointmentId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: anamnesisKeys.prontuario(appointmentId),
			});
		},
	});
}
