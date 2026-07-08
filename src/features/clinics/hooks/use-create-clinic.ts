"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateClinicInput } from "@/lib/schemas/clinic/create-clinic.schema";
import { clinicsRepository } from "../repositories/clinics.repository";
import { clinicKeys } from "./clinic-keys";

export function useCreateClinic() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateClinicInput) => clinicsRepository.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: clinicKeys.all });
		},
	});
}
