"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AnamnesisInput } from "@/lib/schemas/anamnesis/anamnesis.schema";
import { appointmentsRepository } from "../repositories/appointments.repository";
import { anamnesisKeys } from "./appointment-keys";

export function useSaveAnamnesis(appointmentId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: AnamnesisInput) =>
			appointmentsRepository.saveAnamnesis(appointmentId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: anamnesisKeys.anamnesis(appointmentId),
			});
		},
	});
}
