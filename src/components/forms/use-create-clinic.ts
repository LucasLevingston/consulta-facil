"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicKeys } from "@/components/clinic/hooks";
import { clinicsRepository } from "@/features/clinics";
import type { CreateClinicInput } from "@/lib/schemas/clinic/create-clinic.schema";

export function useCreateClinic() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateClinicInput) => clinicsRepository.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: clinicKeys.all });
		},
	});
}
