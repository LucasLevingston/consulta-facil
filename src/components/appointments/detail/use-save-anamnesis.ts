"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { anamnesisRepository } from "@/features/appointments";
import type { AnamnesisInput } from "@/lib/schemas/anamnesis/anamnesis.schema";
import { anamnesisKeys } from "./anamnesis-keys";

export function useSaveAnamnesis(appointmentId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: AnamnesisInput) =>
			anamnesisRepository.saveAnamnesis(appointmentId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: anamnesisKeys.anamnesis(appointmentId),
			});
		},
	});
}
