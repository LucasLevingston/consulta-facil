"use client";

import { useQuery } from "@tanstack/react-query";
import { anamnesisApi } from "@/lib/api/anamnesis.api";
import { anamnesisKeys } from "./anamnesis-keys";

export function useProntuario(appointmentId: string) {
	return useQuery({
		queryKey: anamnesisKeys.prontuario(appointmentId),
		queryFn: () => anamnesisApi.getProntuario(appointmentId),
		enabled: !!appointmentId,
		retry: false,
	});
}
