"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clinicsApi } from "@/lib/api/clinics.api";
import type { CreateClinicInput } from "@/lib/schemas/clinic.schema";
import { clinicKeys } from "./clinic-keys";

export function useUpdateClinic() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: CreateClinicInput }) =>
			clinicsApi.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: clinicKeys.all });
		},
	});
}
