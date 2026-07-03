"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProntuarioInput } from "@/lib/schemas/anamnesis/prontuario.schema";
import { appointmentsRepository } from "../repositories/appointments.repository";
import { anamnesisKeys } from "./appointment-keys";

export function useSaveProntuario(appointmentId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: ProntuarioInput) =>
			appointmentsRepository.saveProntuario(appointmentId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: anamnesisKeys.prontuario(appointmentId),
			});
		},
	});
}
