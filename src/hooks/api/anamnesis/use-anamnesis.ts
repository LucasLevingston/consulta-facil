"use client";

import { useQuery } from "@tanstack/react-query";
import { anamnesisApi } from "@/lib/api/anamnesis/anamnesis.api";
import { anamnesisKeys } from "./anamnesis-keys";

export function useAnamnesis(appointmentId: string) {
	return useQuery({
		queryKey: anamnesisKeys.anamnesis(appointmentId),
		queryFn: () => anamnesisApi.getAnamnesis(appointmentId),
		enabled: !!appointmentId,
		retry: false,
	});
}
