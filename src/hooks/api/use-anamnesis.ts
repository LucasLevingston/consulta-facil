"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { anamnesisApi } from "@/lib/api/anamnesis.api";
import type {
	AnamnesisInput,
	ProntuarioInput,
} from "@/lib/schemas/anamnesis.schema";

export const anamnesisKeys = {
	anamnesis: (appointmentId: string) =>
		["appointments", appointmentId, "anamnesis"] as const,
	prontuario: (appointmentId: string) =>
		["appointments", appointmentId, "prontuario"] as const,
};

export function useAnamnesis(appointmentId: string) {
	return useQuery({
		queryKey: anamnesisKeys.anamnesis(appointmentId),
		queryFn: () => anamnesisApi.getAnamnesis(appointmentId),
		enabled: !!appointmentId,
		retry: false,
	});
}

export function useSaveAnamnesis(appointmentId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: AnamnesisInput) =>
			anamnesisApi.saveAnamnesis(appointmentId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: anamnesisKeys.anamnesis(appointmentId),
			});
		},
	});
}

export function useProntuario(appointmentId: string) {
	return useQuery({
		queryKey: anamnesisKeys.prontuario(appointmentId),
		queryFn: () => anamnesisApi.getProntuario(appointmentId),
		enabled: !!appointmentId,
		retry: false,
	});
}

export function useSaveProntuario(appointmentId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: ProntuarioInput) =>
			anamnesisApi.saveProntuario(appointmentId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: anamnesisKeys.prontuario(appointmentId),
			});
		},
	});
}
