"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicKeys } from "@/components/clinic/hooks";
import { clinicsRepository } from "@/features/clinics";
import type { CreateClinicInput } from "@/lib/schemas/clinic/create-clinic.schema";

export function useUpdateClinic() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: CreateClinicInput }) =>
			clinicsRepository.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: clinicKeys.all });
		},
	});
}
