"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateClinicInput } from "@/lib/schemas/clinic/create-clinic.schema";
import { clinicsRepository } from "../repositories/clinics.repository";
import { clinicKeys } from "./clinic-keys";

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
