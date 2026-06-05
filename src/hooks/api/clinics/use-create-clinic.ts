"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clinicsApi } from "@/lib/api/clinics.api";
import type { CreateClinicInput } from "@/lib/schemas/clinic/create-clinic.schema";
import { clinicKeys } from "./clinic-keys";

export function useCreateClinic() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateClinicInput) => clinicsApi.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: clinicKeys.all });
		},
	});
}
